// Simple supabase client for browser components
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [] }),
    insert: () => Promise.resolve({ data: [] }),
    update: () => Promise.resolve({ data: [] }),
    delete: () => Promise.resolve({ data: [] })
  })
};
