import { computed, ref } from 'vue'

const getInitialTheme = (): boolean => {
    if (typeof window === 'undefined') {
        return false
    }

    const saved = localStorage.getItem('theme')

    if (saved) {
        return saved === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const applyThemeSync = (dark: boolean) => {
    if (typeof document === 'undefined') {
        return
    }

    if (dark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const initialTheme = getInitialTheme()

applyThemeSync(initialTheme)

const isDark = ref(initialTheme)
const bgColor = computed(() => (isDark.value ? 'bg-[#09090b]' : 'bg-white'))
const textColor = '#a1a1aa'

export function useTheme() {
    const applyTheme = (dark: boolean) => {
        applyThemeSync(dark)

        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value

        applyTheme(isDark.value)
    }

    const setTheme = (dark: boolean) => {
        isDark.value = dark

        applyTheme(dark)
    }

    return {
        isDark,
        bgColor,
        textColor,
        toggleTheme,
        setTheme
    }
}
