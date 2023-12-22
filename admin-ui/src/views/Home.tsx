import {StackedAreaChart} from '@/components/StackedAreaChart';
import {series} from '@/data/chart_data';
import '@/styles/app.css';
import {HttpClient} from "@/helpers/api";
import {effect} from "@preact/signals";
import {useEffect, useState} from "react";
import {humanFileSize, humanNumber} from "@/helpers/string";

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

const QueuedMessage = ({metrics}: ReportProps) => {
    return (
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
            <div className="text-gray text-md border-b pb-2">Queued Messages</div>
            <div className="text-4xl py-2">{humanNumber(metrics?.total.value || 0)} <span className="text-lg">Total</span></div>
            <div className="text-sm pt-1 pl-2">
                <span>
                    {humanNumber(metrics?.ready.value || 0 )} <span className="text-xs">Ready</span>
                </span> / <span>{humanNumber(metrics?.unacked.value || 2 )} <span className="text-xs">Unacked</span>
                </span>
            </div>
        </div>
    );
};

const MessagesCard = ({metrics}: ReportProps) => {
    return (
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
            <div className="text-gray text-md border-b pb-2">Messages Count</div>
            <div className="flex gap-10 pt-2">
                <div className="min-w-28">
                    <div>Confirm</div>
                    <div className="text-3xl pt-1">{humanNumber(metrics?.confirm.value || 0)}</div>
                </div>
                <div className="min-w-28">
                    <div>Publish</div>
                    <div className="text-3xl pt-1">{humanNumber(metrics?.publish.value || 0)}</div>
                </div>
                <div className="min-w-28">
                    <div>Deliver</div>
                    <div className="text-3xl pt-1">{humanNumber(metrics?.deliver.value || 0)}</div>
                </div>
                <div className="min-w-28">
                    <div>Acks</div>
                    <div className="text-3xl pt-1">{humanNumber(metrics?.acknowledge.value || 0)}</div>
                </div>
                <div>
                    <div>Get</div>
                    <div className="text-3xl pt-1">{humanNumber(metrics?.get.value || 0)}</div>
                </div>
            </div>
        </div>
    );
};

const TrafficCard = ({metrics}: ReportProps) => {
    return (
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
            <div className="text-gray text-md border-b pb-2">Traffic Volume</div>
            <div className="flex gap-10 pt-2">
                <div className="min-w-28">
                    <div>IN</div>
                    <div className="text-3xl pt-1">{humanFileSize(metrics?.traffic_in.value || 0)}</div>
                </div>
                <div className="min-w-28">
                    <div>Out</div>
                    <div className="text-3xl pt-1">{humanFileSize(metrics?.traffic_out.value || 0)}</div>
                </div>
            </div>
        </div>
    );
};

export const Home = () => {
    const [metrics, setMetrics] = useState({})
    const [counters, setCounters] = useState()
    const [serverInfo, setServerInfo] = useState()
    const updateMetrics = (data) => {
        let metricsData = data.metrics ? data.metrics : [];
        let mt = {}
        metricsData.forEach((metric) => {
            if (metric.name === 'server.traffic_in' || metric.name === 'server.traffic_out') {
                metric.sample = metric.sample.map((sample) => {
                    if (sample) {
                        // convert to MB/s
                        sample.value = humanFileSize(sample.value) + "/s"
                    }
                    return sample
                })
                mt[metric.name.replaceAll('server.', '')] = {
                    sample: metric.sample,
                    value: metric.value,
                }
                return mt
            } else {
                mt[metric.name.replaceAll('server.', '')] = {
                    sample: metric.sample,
                    value: metric.value,
                }
                return mt
            }
        })
        setMetrics({server: mt})
    }
    const getOverview = () => {
        HttpClient.get("/overview").then(response => {
            if(response.data.hasOwnProperty('metrics')) {
                updateMetrics(response.data)
                setServerInfo(response.data.server_info)
                setCounters(response.data.counters)
                setTimeout(() => {
                    getOverview()
                }, 2000)
            }
        })
    }
    useEffect(() => {
        getOverview()
    }, []);
    return (
        <div>
            <h1 className="text-3xl font-semibold">
                {serverInfo?.name} <span className="font-normal text-base">@ {serverInfo?.url}</span>
            </h1>
            <div className="flex flex-wrap gap-5 pt-4">
                <QueuedMessage metrics={metrics?.server} />
                <MessagesCard metrics={metrics?.server} />
                <TrafficCard metrics={metrics?.server} />
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
