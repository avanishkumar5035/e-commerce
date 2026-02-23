/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary_navy: {
                    light: "#232f3e",
                    DEFAULT: "#131921",
                },
                accent_gold: "#FF9900",
                bg_light: "#EAEDED",
                accent_teal: "#007185",
                btn_add_to_cart: "#FFD814",
                btn_buy_now: "#FFA41C",
                text_main: "#0F1111",
                text_secondary: "#565959",
            },
            fontFamily: {
                sans: ['Poppins', 'Roboto', 'Open Sans', 'ui-sans-serif', 'system-ui'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
                open: ['Open Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
