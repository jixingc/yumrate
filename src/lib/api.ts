import { supabase } from './supabase';
import type { Restaurant, RarityLevel } from '../types';

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      visit_records (
        *,
        dishes (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    score: Number(r.score),
    pricePerPerson: Number(r.price_per_person),
    tags: r.tags || [],
    shortReview: r.short_review || '',
    isCuratorOriginal: r.is_curator_original,
    rarity: r.rarity as RarityLevel,
    visitRecords: (r.visit_records || []).map((v: any) => ({
      id: v.id,
      reviewerName: v.reviewer_name,
      date: v.date,
      totalCost: Number(v.total_cost),
      overallExperience: v.overall_experience || '',
      coverImage: v.cover_image,
      scores: {
        taste: Number(v.taste_score),
        value: Number(v.value_score),
        env: Number(v.env_score),
        unique: Number(v.unique_score),
        total: Number(v.total_score)
      },
      dishes: (v.dishes || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        review: d.review
      }))
    }))
  }));
};

// 工具函数：Base64 转 Blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const uploadImage = async (base64Image: string): Promise<string | null> => {
  try {
    const blob = dataURLtoBlob(base64Image);
    const fileName = `cover_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteVisitRecord = async (visitRecordId: string, restaurantId: string) => {
  try {
    // 1. 删除菜品
    await supabase.from('dishes').delete().eq('visit_record_id', visitRecordId);

    // 2. 删除探店记录
    const { error: visitErr } = await supabase.from('visit_records').delete().eq('id', visitRecordId);
    if (visitErr) throw visitErr;

    // 3. 检查剩余的探店记录
    const { data: visits } = await supabase.from('visit_records').select('total_score, total_cost').eq('restaurant_id', restaurantId);

    if (!visits || visits.length === 0) {
      // 4. 如果没有探店记录了，直接删除整个餐厅
      const { error: restErr } = await supabase.from('restaurants').delete().eq('id', restaurantId);
      if (restErr) throw restErr;
      return { success: true, restaurantDeleted: true };
    } else {
      // 5. 重新计算分数和人均
      const avgScore = visits.reduce((acc, v) => acc + Number(v.total_score), 0) / visits.length;
      const avgPrice = visits.reduce((acc, v) => acc + Number(v.total_cost), 0) / visits.length;

      let rarity: RarityLevel = 'n';
      if (avgScore >= 9.1) rarity = 'ur';
      else if (avgScore >= 8.6) rarity = 'ssr';
      else if (avgScore >= 8.1) rarity = 'sr';
      else if (avgScore >= 6.6) rarity = 'r';

      const { error: updateErr } = await supabase.from('restaurants').update({
        score: Number(avgScore.toFixed(1)),
        price_per_person: Math.round(avgPrice),
        rarity: rarity
      }).eq('id', restaurantId);

      if (updateErr) throw updateErr;
      return { success: true, restaurantDeleted: false };
    }
  } catch (error) {
    console.error('Error deleting visit record:', error);
    return { success: false, error };
  }
};

export const saveEntry = async (entryData: {
  restaurantId?: string; // 如果有则是添加探店记录，如果没有则是新建餐厅
  restaurantName: string;
  location: string;
  pricePerPerson: number;
  tags: string[];
  shortReview: string;
  reviewerName: string;
  date: string;
  totalCost: number;
  overallExperience: string;
  coverImage: string | null;
  scores: {
    taste: number;
    value: number;
    env: number;
    unique: number;
    total: number;
  };
  dishes: { name: string; review: string }[];
  recordId?: string; // 如果存在则是更新记录
}) => {
  try {
    let restId = entryData.restaurantId;

    // 1. 如果没有 restaurantId，创建新餐厅基础记录
    if (!restId) {
      const { data: newRest, error: restErr } = await supabase.from('restaurants').insert({
        name: entryData.restaurantName,
        location: entryData.location,
        score: entryData.scores.total,
        price_per_person: entryData.pricePerPerson,
        rarity: 'n'
      }).select().single();

      if (restErr) throw restErr;
      restId = newRest.id;
    }

    // 2. 上传图片 (如果存在且是 Base64)
    let imageUrl = entryData.coverImage;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl);
    }

    let visitRecordId = entryData.recordId;

    // 3. 创建或更新探店记录
    const visitData = {
      restaurant_id: restId,
      reviewer_name: entryData.reviewerName,
      date: entryData.date,
      total_cost: entryData.totalCost,
      overall_experience: entryData.overallExperience,
      cover_image: imageUrl,
      taste_score: entryData.scores.taste,
      value_score: entryData.scores.value,
      env_score: entryData.scores.env,
      unique_score: entryData.scores.unique,
      total_score: entryData.scores.total
    };

    if (visitRecordId) {
      const { error: updateErr } = await supabase.from('visit_records')
        .update(visitData)
        .eq('id', visitRecordId);
      if (updateErr) throw updateErr;

      // 删除旧菜品 (增加了对删除错误的捕获)
      const { error: deleteErr } = await supabase.from('dishes').delete().eq('visit_record_id', visitRecordId);
      if (deleteErr) {
        console.error('Delete old dishes error:', deleteErr);
        throw deleteErr;
      }
    } else {
      const { data: newVisit, error: visitErr } = await supabase.from('visit_records')
        .insert(visitData)
        .select().single();
      if (visitErr) throw visitErr;
      visitRecordId = newVisit.id;
    }

    // 4. 插入新菜品
    const validDishes = entryData.dishes.filter(d => d.name.trim() !== '');
    if (validDishes.length > 0) {
      const dishInserts = validDishes.map(d => ({
        visit_record_id: visitRecordId,
        name: d.name,
        review: d.review
      }));
      const { error: dishErr } = await supabase.from('dishes').insert(dishInserts);
      if (dishErr) throw dishErr;
    }

    // 5. 重新聚合计算并更新餐厅主表（确保卡片上的数据始终是最新的）
    const { data: visits } = await supabase.from('visit_records').select('total_score, total_cost').eq('restaurant_id', restId);

    let avgScore = entryData.scores.total;
    let avgPrice = entryData.pricePerPerson;

    if (visits && visits.length > 0) {
      avgScore = visits.reduce((acc, v) => acc + Number(v.total_score), 0) / visits.length;
      avgPrice = visits.reduce((acc, v) => acc + Number(v.total_cost), 0) / visits.length;
    }

    let rarity: RarityLevel = 'n';
    if (avgScore >= 9.1) rarity = 'ur';
    else if (avgScore >= 8.6) rarity = 'ssr';
    else if (avgScore >= 8.1) rarity = 'sr';
    else if (avgScore >= 6.6) rarity = 'r';

    await supabase.from('restaurants').update({
      name: entryData.restaurantName,
      location: entryData.location,
      tags: entryData.tags,
      short_review: entryData.shortReview,
      score: Number(avgScore.toFixed(1)),
      price_per_person: Math.round(avgPrice),
      rarity: rarity
    }).eq('id', restId);

    return { success: true };
  } catch (error) {
    console.error('Error saving entry:', error);
    return { success: false, error };
  }
};
