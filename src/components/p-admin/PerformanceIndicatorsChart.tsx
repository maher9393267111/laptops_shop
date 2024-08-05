import PieChartComponent from '@/components/p-admin/PieChart';
import { MainPageDashboardProps } from '@/pages/admin-panel';

const PerformanceIndicatorsChart = ({ performanceIndicators }: Partial<MainPageDashboardProps>) => {
    return (
        <div className='bg-white rounded-xl shadow-sm flex flex-col w-full gap-3 p-6 h-[372px]'>

            <div className='space-y-1'>
                <h3 className='font-extrabold text-panel-darkTitle font-peyda text-[28px]'>مخطط مؤشرات الأداء</h3>
                <p className='text-[#A3A3A3] text-[13px]'>يقدم نظرة عامة على المقاييس الرئيسية للموقع (مقارنة بالشهر الماضي)</p>
            </div>

            <div className='flex items-center md:flex-nowrap flex-wrap justify-center gap-6 font-peyda min-h-[250px] h-full'>
                <PieChartComponent color='red' percentage={performanceIndicators?.transactionsCountPercentage!} title='المعاملات' />
                <PieChartComponent color='green' percentage={performanceIndicators?.userCountGrowsPercentage!} title='نمو المستخدم' />
                <PieChartComponent color='blue' percentage={performanceIndicators?.totalIncomeGrowsPercentage!} title='إجمالي الدخل' />
            </div>
        </div>
    )
}

export default PerformanceIndicatorsChart