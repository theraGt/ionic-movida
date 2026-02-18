import { ref } from 'vue';

const isSidebarOpen = ref(false);

export function useLayout() {
    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    };

    const closeSidebar = () => {
        isSidebarOpen.value = false;
    };

    const openSidebar = () => {
        isSidebarOpen.value = true;
    };

    return {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar
    };
}
