import {StackedAreaChart} from '@/components/StackedAreaChart';
import {series} from '@/data/chart_data';
import '@/styles/app.css';

interface ReportProps {
    title: string;
    data: any;
}

const Report = ({title, data}: ReportProps) => {
    return (
        <div>
            <div className="text-gray text-md">{title}</div>
            <div className="text-4xl pt-1">{data}</div>
        </div>
    );
};

export const Home = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold">
                Test Server 2 <span className="font-normal text-base">@ 192.168.1.64</span>
            </h1>
            <div className="flex gap-20 pt-4 justify-between">
                <div className="w-full flex flex-wrap gap-5 justify-between">
                    <Report title="Total Messages In" data="337.51m"/>
                    <Report title="Total Messages Out" data="345.99m"/>
                    <Report title="Total Data Volume In" data="60.94GB"/>
                    <Report title="Total Data Volume Out" data="62.46GB"/>
                </div>
                <div className="w-full flex flex-wrap gap-5 justify-between">
                    <Report title="Message In Rate" data="1.37k"/>
                    <Report title="Message Out Rate" data="1.89k"/>
                    <Report title="Incoming Data Rate" data="247.61KB/s"/>
                    <Report title="Outgoing Data Rate" data="337.94KB/s"/>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 pt-10 gap-10">
                <StackedAreaChart series={series} colors={['#008FFB', '#00E396', '#CED4DC']} dataOptions={{title: "Message Rate", xaxis:{type:"datetime"}, yaxis:{type:"number"}}} height={350}/>
                <StackedAreaChart series={series} colors={['#008FFB', '#00E396', '#CED4DC']} dataOptions={{title: "Traffic Volume", xaxis:{type:"datetime"}, yaxis:{type:"number"}}} height={350}/>
            </div>
            <div className="gap-10 pl-5">
                <div>
                    <h1 className="text-dark-gray py-5">Queues</h1>
                    <div className="flex flex-col border rounded-md p-2">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Name
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Status
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Ready
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Unacked
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Persistent
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Total
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Incoming
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Deliver
                                                </th>
                                                <th scope="col"
                                                    className="px-2 py-2 text-start text-xs font-medium text-gray-600 uppercase">
                                                    Ack
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-200">
                                                    <div>routee-provider</div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">running</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-200">
                                                    <div>smsto-provider</div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">running</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-200">
                                                    <div>messagebird-provider</div>
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">running</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">0/s</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
