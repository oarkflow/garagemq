import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss';
import transformerDirective from '@unocss/transformer-directives';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import presetWebFonts from '@unocss/preset-web-fonts';

export default defineConfig({
  theme: {
    extend: {
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite'
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' }
        }
      }
    },
    fontSize: {
      tiny: '0.73rem'
    },
    boxShadow: {
      't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
      't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
      't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)'
    },
    colors: {
      blue: {
        50: '#EBF3FE',
        100: '#D8E6FD',
        200: '#B1CEFB',
        300: '#8AB5FA',
        400: '#639CF8',
        500: '#3B82F6',
        600: '#0B60EA',
        700: '#0848B0',
        800: '#053075',
        900: '#03183B',
        950: '#010C1D'
      },
      brightBlue: {
        50: '#E3F2FC',
        100: '#C7E5FA',
        200: '#94CEF5',
        300: '#5CB4EF',
        400: '#299DEA',
        500: '#137DC5',
        600: '#0F659E',
        700: '#0B4A74',
        800: '#08324F',
        900: '#041825',
        950: '#020C13'
      },
      red: {
        50: '#FDECEC',
        100: '#FCD9D9',
        200: '#F9B4B4',
        300: '#F58E8E',
        400: '#F26969',
        500: '#EF4444',
        600: '#E11313',
        700: '#A90F0F',
        800: '#710A0A',
        900: '#380505',
        950: '#1C0202'
      },
      green: {
        50: '#E9FBF0',
        100: '#CFF7DE',
        200: '#9FEFBC',
        300: '#6FE69B',
        400: '#40DE7A',
        500: '#22C55E',
        600: '#1B9D4B',
        700: '#147538',
        800: '#0D4E25',
        900: '#072713',
        950: '#04160A'
      },
      purple: {
        50: '#F8F0FE',
        100: '#EEDDFD',
        200: '#DCBBFC',
        300: '#CB99FA',
        400: '#BA77F9',
        500: '#A855F7',
        600: '#8815F4',
        700: '#6609BE',
        800: '#44067F',
        900: '#22033F',
        950: '#120222'
      },
      brand: {
        50: '#EBEBFF',
        100: '#D2D2FE',
        200: '#A6A4FE',
        300: '#7E7CFD',
        400: '#524FFD',
        500: '#2522FC',
        600: '#0703E2',
        700: '#0502AB',
        800: '#03026F',
        900: '#020137',
        950: '#01001E'
      },
      yellow: {
        50: '#FEF5E7',
        100: '#FDECCE',
        200: '#FBD99D',
        300: '#F9C56C',
        400: '#F7B23B',
        500: '#F59E0B',
        600: '#C47F08',
        700: '#935F06',
        800: '#624004',
        900: '#312002',
        950: '#181001'
      },
      orange: {
        50: '#FEF2EC',
        100: '#FDE4D8',
        200: '#FBCAB1',
        300: '#F9AF8B',
        400: '#F79564',
        500: '#F5793B',
        600: '#E9560C',
        700: '#AF4009',
        800: '#742B06',
        900: '#3A1503',
        950: '#1D0B01'
      },
      heavyGray: {
        50: '#EEF0F2',
        100: '#DCE1E5',
        200: '#B6C0C8',
        300: '#94A1AE',
        400: '#718393',
        500: '#54626F',
        600: '#444F5A',
        700: '#333B43',
        800: '#21262C',
        900: '#121417',
        950: '#090A0C'
      },
      buttercup: {
        '50': '#FFFDF2',
        '100': '#FFFBE8',
        '200': '#FCF1C2',
        '300': '#FAE69D',
        '400': '#F7CC57',
        '500': '#f6ae12',
        '600': '#DB930D',
        '700': '#B87209',
        '800': '#945406',
        '900': '#6E3803',
        '950': '#472001'
      },
      baliHai: {
        '50': '#F7FAFA',
        '100': '#F2F7F7',
        '200': '#DDE8EB',
        '300': '#C8DADE',
        '400': '#A5BFC7',
        '500': '#84a2ad',
        '600': '#6A8D9C',
        '700': '#4A6E82',
        '800': '#305169',
        '900': '#1B374F',
        '950': '#0B1E33'
      },
      crocodile: {
        '50': '#F7F6F2',
        '100': '#F2F1EB',
        '200': '#DEDACC',
        '300': '#C9C3AF',
        '400': '#A1957D',
        '500': '#796b52',
        '600': '#6B5A41',
        '700': '#59462E',
        '800': '#47321D',
        '900': '#362211',
        '950': '#241307'
      },
      'dark-blue': {
        '50': '#F5FAFF',
        '100': '#EBF4FF',
        '200': '#CFE2FF',
        '300': '#B0C9FF',
        '400': '#728BFC',
        '500': '#383ffc',
        '600': '#2D33E3',
        '700': '#1E23BD',
        '800': '#141896',
        '900': '#0B0D73',
        '950': '#04064A'
      },
      scooter: {
        '50': '#F0FCFC',
        '100': '#E3FBFC',
        '200': '#BAF2F7',
        '300': '#91E9F2',
        '400': '#46D7EB',
        '500': '#01c4e0',
        '600': '#00A5C9',
        '700': '#007EA8',
        '800': '#005F87',
        '900': '#004166',
        '950': '#002642'
      },
      jacarta: {
        '50': '#F4F0F7',
        '100': '#E7DFF0',
        '200': '#C5B6D9',
        '300': '#A28FC2',
        '400': '#5D4E91',
        '500': '#272263',
        '600': '#211C59',
        '700': '#16124A',
        '800': '#0F0C3B',
        '900': '#09072E',
        '950': '#04031C'
      },
      lightBlue: {
        50: '#E7F6FE',
        100: '#CFEEFC',
        200: '#9ADBF9',
        300: '#6ACAF6',
        400: '#3AB8F3',
        500: '#0EA5E9',
        600: '#0B84BC',
        700: '#08628C',
        800: '#05405B',
        900: '#032230',
        950: '#011118'
      },
      blueGray: {
        50: '#F0F2F4',
        100: '#DEE2E8',
        200: '#C1C8D2',
        300: '#A0ABBB',
        400: '#8291A5',
        500: '#64748B',
        600: '#515E71',
        700: '#3C4553',
        800: '#292F38',
        900: '#13161B',
        950: '#0B0C0F'
      },
      dark: {
        50: '#E8E8E8',
        100: '#D1D1D1',
        200: '#A6A6A6',
        300: '#787878',
        400: '#4D4D4D',
        500: '#1F1F1F',
        600: '#1A1A1A',
        700: '#121212',
        800: '#0D0D0D',
        900: '#050505',
        950: '#030303'
      },
      primary: '#186180',
      primaryDark: '#074454',
      secondary: '#1CD69A',
      secondaryDark: '#35B58CFF',
      // "dark": "hsl(220, 95%, 8%)",
      lightDark: 'hsl(219,77%,15%)',
      light: '#142E66FF',
      prussianBlue: '#012A4A',
      indigoDye: '#013A63',
      proBlue: '#01497C',
      darkBlue: '#0662A6',
      royalBlue: '#01497C',
      ucla: '#2A6F97',
      cerulean: '#2C7DA0',
      airBlue: '#468FAF',
      superiorBlue: '#61A5C2',
      skyBlue: '#89C2D9'
    }
  },
  shortcuts: [
    {
      'btn-primary':
        'text-sm whitespace-nowrap py-1 px-4 flex justify-center items-center bg-primary-dark hover:bg-primary focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center font-thin shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
      'btn-secondary':
        'text-sm whitespace-nowrap py-1 px-4 flex justify-center items-center bg-secondary-dark hover:bg-secondary focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center font-thin shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
      'btn-default':
        'text-sm whitespace-nowrap border py-1 px-4 flex justify-center items-center bg-gray-100 hover:bg-white text-primary-dark w-full transition ease-in duration-200 text-center font-thin rounded'
    },
    [
      'icon-btn',
      'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'
    ]
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        poppins: 'Poppins:200,300,400,500,600,700,800,900',
        quicksand: 'Quicksand:200,300,400,500,600,700,800,900'
      }
    })
  ],
  transformers: [transformerDirective(), transformerCompileClass(), transformerVariantGroup()],
  safelist: [
    'col-span-1',
    'flex',
    'shadow-sm',
    'rounded-md',
    'flex-shrink-0',
    'items-center',
    'justify-center',
    'w-16',
    'text-white',
    'text-sm',
    'font-medium',
    'rounded-l-md',
    'flex-1',
    'px-4',
    'py-2',
    'pr-2',
    'w-8',
    'h-8',
    'inline-flex',
    'text-gray-400',
    'rounded-full',
    'bg-transparent',
    'hover:text-gray-500',
    'hover:bg-blue-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-indigo-500'
  ]
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
});
