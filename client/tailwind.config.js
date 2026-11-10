/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 🟠 Orange / Amber Primary Palette
                deep_blue: "#E8630A",           // Deep Orange
                deep_blue_dark: "#C4500A",      // Darker Orange
                sky_blue: "#F59E0B",            // Amber/Dark Yellow
                sky_blue_dark: "#D97706",       // Darker Amber

                // 🌑 Stylish Luxury Dark Theme (NO COLD BLUE!)
                // Re-mapping slate to ultra-stylish rich obsidian & velvet charcoal
                slate: {
                    50: '#F9F8F6',
                    100: '#F2EFEB',
                    200: '#E5E1DA',
                    300: '#C7C2BA',
                    400: '#9C968D',
                    500: '#6E6860',
                    600: '#4D4740',
                    700: '#26222B',   // sleek dark border / divider
                    750: '#201D25',
                    800: '#17151D',   // stylish dark card (rich velvet obsidian, ZERO blue)
                    850: '#131117',   // stylish surface
                    900: '#0E0D12',   // stylish dark page background (deep obsidian, ZERO blue)
                    950: '#08070A',   // deepest dark
                },

                // Dedicated stylish dark tokens
                dark_bg: "#0E0D12",
                dark_surface: "#17151D",
                dark_card: "#17151D",
                dark_card_hover: "#221E2A",
                dark_border: "#26222B",
                dark_muted: "#8A8494",

                // Backgrounds
                bg_soft_gray: "#FFF8F0",        // Warm cream background
                bg_cool_gray: "#FFF3E0",        // Slightly orange-tinted bg
                header_bg: "#FFFFFF",

                // Text
                dark_charcoal: "#1C1C1E",
                text_secondary: "#6B7280",

                // Keep e-commerce specific colors
                accent_gold: "#FF9900",
                btn_add_to_cart: "#FFD814",
                btn_buy_now: "#FFA41C",

                // Keep old names for compatibility
                royal_blue: "#E8630A",
                royal_blue_dark: "#C4500A",
                royal_blue_deep: "#7C2D12",
            },
            fontFamily: {
                sans: ['Poppins', 'Roboto', 'Open Sans', 'ui-sans-serif', 'system-ui'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                }
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
                fadeUp: 'fadeUp 0.5s ease-out forwards',
                bounceSoft: 'bounceSoft 2s ease-in-out infinite',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            }
        },
    },
    plugins: [],
}
