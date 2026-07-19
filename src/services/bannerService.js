import { supabase } from '../lib/supabase'

export async function getHomepageSliderData() {
  const [bannersRes, settingsRes] = await Promise.all([
    supabase
      .from('homepage_banners')
      .select('id, image_url, alt_text, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('homepage_slider_settings')
      .select('autoplay_delay_ms')
      .eq('id', 1)
      .single(),
  ])

  if (bannersRes.error) throw bannersRes.error

  const settingsNotFound = settingsRes.error?.code === 'PGRST116'
  if (settingsRes.error && !settingsNotFound) throw settingsRes.error

  return {
    banners: bannersRes.data || [],
    autoplayDelayMs: settingsRes.data?.autoplay_delay_ms || 2000,
  }
}
