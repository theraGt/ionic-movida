import { ref, watch, onMounted } from 'vue';

const isDarkMode = ref(false);

export function useDarkMode() {
    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
    };

    const setDarkMode = (value: boolean) => {
        isDarkMode.value = value;
    };

    const applyDarkMode = (dark: boolean) => {
        if (dark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    onMounted(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            isDarkMode.value = stored === 'true';
        } else {
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyDarkMode(isDarkMode.value);
    });

    watch(isDarkMode, (newValue) => {
        localStorage.setItem('darkMode', String(newValue));
        applyDarkMode(newValue);
    });

    return {
        isDarkMode,
        toggleDarkMode,
        setDarkMode
    };
}
