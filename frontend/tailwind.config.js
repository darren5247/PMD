/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        letterSpacing: {
            thigh: '0.2px',
            normal: '0'
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1202px',
            xl: '1280px',
            '2xl': '1536px'
        },
        extend: {
            content: {
                'checkbox-chevron': 'url("/checkbox-chevron.svg")',
                'checkbox-chevron-small': 'url("/checkbox-chevron-small.svg")'
            },
            boxShadow: {
                musicCard: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                elementCard: '0px 1px 6px rgba(0, 0, 0, 0.15)',
                navDropdown: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                header: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                tooltip: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                activeFilter: '0px 0px 2px rgba(0, 0, 0, 0.25)',
                button: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                workNav: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                sidebar: '1px 0px 1px rgba(0, 0, 0, 0.1)'
            },
            fontFamily: {
                montserrat: ['Montserrat Variable', ...defaultTheme.fontFamily.sans]
            },
            fontSize: {
                sm: ['14px', '17.07px'],
                base: ['16px', '24px'],
                lg: ['18px', '21.94px']
            },
            colors: {
                pmdRed: '#7F1D1D',
                pmdGrayBright: '#FAFAF9',
                pmdGrayLight: '#E7E5E4',
                pmdGray: '#A8A29E',
                pmdGrayDark: '#262626'
            }
        }
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('children', '& > *');
        }
    ]
};
