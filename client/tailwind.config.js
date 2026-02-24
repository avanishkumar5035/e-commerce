/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                deep_blue: "#1E3A8A",
                deep_blue_dark: "#1E3E8F", // Slightly darker for hover
                sky_blue: "#0EA5E9",
                sky_blue_dark: "#0284C7",
                bg_soft_gray: "#F8FAFC",
                header_bg: "#FFFFFF",
                dark_charcoal: "#333333",
                text_secondary: "#565959",
                accent_gold: "#FF9900",
                btn_add_to_cart: "#FFD814",
                btn_buy_now: "#FFA41C",
                // Keep old names for compatibility during migration if needed, but mapped to new palette
                royal_blue: "#1E3A8A",
                royal_blue_dark: "#1E3E8F",
                royal_blue_deep: "#111827", // Using slate-900 equivalent for deep footer
            },
            fontFamily: {
                sans: ['Poppins', 'Roboto', 'Open Sans', 'ui-sans-serif', 'system-ui'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
