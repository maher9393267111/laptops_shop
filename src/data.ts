import { categories } from "./global.t";

const productSortOptions = [
    { text: "ارزان‌ترین", sort: "cheap" },
    { text: "گران‌ترین", sort: "exp" },
    { text: "پرفروش‌ترین‌", sort: "well-sell" },
]

const chartColors = {
    red: {
        light: 'rgba(255, 91, 91, 0.15)',
        dark: '#FF5B5B'
    },
    green: {
        light: 'rgba(0, 175, 116, 0.15)',
        dark: '#00B074'
    },
    blue: {
        light: 'rgba(45, 156, 219, 0.15)',
        dark: '#2D9CDB'
    }
}

type WeekDays = 'الاثنين' | 'الثلاثاء' | 'الاربعاء' | 'الخميس' | 'الجمعة' | 'السبت' | 'الاحد'

export interface weekDaysChartProps {
    name: WeekDays,
    uv: number
}

let weekDaysChart: weekDaysChartProps[] = [
    {
        name: 'السبت',
        uv: 0,
    },
    {
        name: 'الاحد',
        uv: 0,
    },
    {
        name: 'الاثنين',
        uv: 0,
    },
    {
        name: 'الثلاثاء',
        uv: 0,
    },
    {
        name: 'الاربعاء',
        uv: 0,
    },
    {
        name: 'الخميس',
        uv: 0,
    },
    {
        name: 'الجمعة',
        uv: 0,
    },
];

const categoriesDate: Partial<{ [key in categories]: string[] }> = {
    accessory: ['mouse', 'keyboard', 'headphone', 'webcam'],
    console: [],
    laptop: [],
    parts: ['motherboard', 'cpu', 'gpu', 'ram', 'cooler', 'ssd'],
    pc: []
}

export { productSortOptions, chartColors, weekDaysChart, categoriesDate }