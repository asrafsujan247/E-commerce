import { create } from "zustand";

interface SidebarState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isModalOpen: boolean;
  toggleModal: () => void;
  closeModal: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleChangePage: (page: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  closeCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  categoryDrawerOpen: boolean;
  toggleCategoryDrawer: () => void;
  closeCategoryDrawer: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeTab: "need",
  setActiveTab: (activeTab) => set({ activeTab }),

  isModalOpen: false,
  toggleModal: () => set((s) => ({ isModalOpen: !s.isModalOpen })),
  closeModal: () => set({ isModalOpen: false }),

  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  handleChangePage: (currentPage) => set({ currentPage }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  drawerOpen: false,
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  closeDrawer: () => set({ drawerOpen: false }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  cartDrawerOpen: false,
  toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  setCartDrawerOpen: (cartDrawerOpen) => set({ cartDrawerOpen }),

  categoryDrawerOpen: false,
  toggleCategoryDrawer: () =>
    set((s) => ({ categoryDrawerOpen: !s.categoryDrawerOpen })),
  closeCategoryDrawer: () => set({ categoryDrawerOpen: false }),
}));

export const useSidebar = useSidebarStore;
