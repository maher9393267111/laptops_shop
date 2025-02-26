import { MainPageDashboardProps } from '@/pages/admin-panel';
import { getCurrentPersianWeekday } from '@/utils';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const VisitsChartDate = ({ visitsData }: Partial<MainPageDashboardProps>) => {

    let currentAndLastWeekVisitData = [
        {
            name: 'السبت',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الاحد',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الاثنين',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الثلاثاء',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الاربعاء',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الخميس',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
        {
            name: 'الجمعة',
            "هفته قبل": 0,
            "هفته فعلی": 0
        },
    ];

    visitsData?.lastWeekVisitsData.forEach(data => {

        const currentDay = new Date().getDay()
        const visitsWeekDay = new Date(data.date).getDay()

        const weekday = getCurrentPersianWeekday(visitsWeekDay);
        const chartItemIndex = currentAndLastWeekVisitData.findIndex(chartData => chartData.name === weekday);

        if (chartItemIndex !== -1 && (currentDay >= visitsWeekDay || visitsWeekDay == 6)) {
            currentAndLastWeekVisitData[chartItemIndex] = {
                ...currentAndLastWeekVisitData[chartItemIndex],
                ['هفته قبل']: currentAndLastWeekVisitData[chartItemIndex]['هفته قبل'] += data.count
            };
        }
    });

    visitsData?.currentWeekVisitsData.forEach(data => {

        const currentDay = new Date().getDay()
        const visitsWeekDay = new Date(data.date).getDay()

        const weekday = getCurrentPersianWeekday(visitsWeekDay);
        const chartItemIndex = currentAndLastWeekVisitData.findIndex(chartData => chartData.name === weekday);

        if (chartItemIndex !== -1 && (currentDay >= visitsWeekDay || visitsWeekDay == 6)) { // wtf is visitsWeekDay == 6 ? in iran its السبت , so we always want to show it
            currentAndLastWeekVisitData[chartItemIndex] = {
                ...currentAndLastWeekVisitData[chartItemIndex],
                ["هفته فعلی"]: currentAndLastWeekVisitData[chartItemIndex]["هفته فعلی"] += data.count
            };
        }
    });

    return (
        <div className='bg-white rounded-xl flex-1 shadow-sm flex flex-col w-full gap-3 p-6 xl:h-[430px] h-auto'>

            <div>
                <h4 className='font-bold text-2xl text-panel-darkTitle font-peyda'>مخطط الزيارات</h4>
                <p className='font-sans text-[12px] text-panel-caption flex items-center justify-start'>رسم بياني لعدد الزيارات في أيام الأسبوع المختلفة</p>
            </div>

            <ResponsiveContainer className={'text-panel-caption text-sm font-peyda'} width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={currentAndLastWeekVisitData}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickMargin={40} width={80} />
                    <Tooltip formatter={(value) => [`${value}`, 'بازدید']} cursor={false} />
                    <Legend />
                    <Bar dataKey="هفته فعلی" fill="#00B074" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                    <Bar dataKey="هفته قبل" fill="#FF5B5B" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default VisitsChartDate