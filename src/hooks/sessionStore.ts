import { create } from 'zustand';
import type { CapturedPhoto, Ingredient, RecipeSuggestion } from '../types';

interface SessionState {
  // Phase 1: Capture
  photos: CapturedPhoto[];
  addPhoto: (photo: CapturedPhoto) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;

  // Phase 2: Ingredient review
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  removeIngredient: (id: string) => void;
  addIngredient: (ingredient: Ingredient) => void;

  // Phase 3: Recipes
  recipes: RecipeSuggestion[];
  setRecipes: (recipes: RecipeSuggestion[]) => void;

  // Reset entire session
  resetSession: () => void;
}

const initialState = {
  photos: [],
  ingredients: [],
  recipes: [],
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,

  addPhoto: (photo) =>
    set((state) => ({ photos: [...state.photos, photo] })),

  removePhoto: (id) =>
    set((state) => ({ photos: state.photos.filter((p) => p.id !== id) })),

  clearPhotos: () => set({ photos: [] }),

  setIngredients: (ingredients) => set({ ingredients }),

  removeIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i.id !== id),
    })),

  addIngredient: (ingredient) =>
    set((state) => ({ ingredients: [...state.ingredients, ingredient] })),

  setRecipes: (recipes) => set({ recipes }),

  resetSession: () => set(initialState),
}));
