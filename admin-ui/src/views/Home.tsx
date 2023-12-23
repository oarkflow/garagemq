import {StackedAreaChart} from '@/components/charts/StackedAreaChart';
import {series} from '@/data/chart_data';
import '@/styles/app.css';
import {HttpClient} from "@/helpers/api";
import {fromUnixTime, format} from 'date-fns'
import {useEffect, useState} from "react";
import {humanFileSize, humanNumber} from "@/helpers/string";
import {Queues} from "@/views/queues";
import {Example} from "@/components/charts/ExampleChart";

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
                    <div className="text-3xl pt-1">{humanFileSize(metrics?.traffic_in?.value || 0)}</div>
                </div>
                <div className="min-w-28">
                    <div>Out</div>
                    <div className="text-3xl pt-1">{humanFileSize(metrics?.traffic_out?.value || 0)}</div>
                </div>
            </div>
        </div>
    );
};

export const Home = () => {
    const [metrics, setMetrics] = useState({})
    const [counters, setCounters] = useState()
    const [serverInfo, setServerInfo] = useState()
    const [queuedMessages, setQueuedMessages] = useState([])
    const [queues, setQueues] = useState([])
    const [messages, setMessages] = useState([])
    const [traffic, setTraffic] = useState([])
    const updateMetrics = (data) => {
        let metricsData = data.metrics ? data.metrics : [];
        let mt = {}
        let qs = {}
        let ms = {}
        let ts = {}
        metricsData.forEach((metric) => {
            let name = metric.name.replaceAll('server.', '')
            if (metric.name === 'server.traffic_in' || metric.name === 'server.traffic_out') {
                metric.sample = metric.sample.map((sample) => {
                    if (sample) {
                        sample.value = humanFileSize(sample.value) + "/s"
                    }
                    return sample
                })
                mt[name] = {
                    sample: metric.sample,
                    value: metric.value,
                }
                if (['total', 'unacked', 'ready'].includes(name)) {
                    qs[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                } else if (['acknowledge', 'get', 'confirm', 'deliver', 'publish'].includes(name)) {
                    ms[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                } else if (['traffic_in', 'traffic_out'].includes(name)) {
                    ts[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                }

            } else {
                mt[name] = {
                    sample: metric.sample,
                    value: metric.value,
                }
                if (['total', 'unacked', 'ready'].includes(name)) {
                    qs[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                } else if (['acknowledge', 'get', 'confirm', 'deliver', 'publish'].includes(name)) {
                    ms[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                } else if (['traffic_in', 'traffic_out'].includes(name)) {
                    ts[name] = {
                        name: name,
                        data: metric.sample.map((metric) => [format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s'), metric.value])
                    }
                }
            }
        })
        setQueuedMessages(Object.values(qs))
        setMessages(Object.values(ms))
        setTraffic(Object.values(ts))
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
                }, 500)
            }
            if(response.data.hasOwnProperty('queues')) {
                setQueues(response.data.queues.items)
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
            <div className="grid lg:grid-cols-3 pt-10 gap-10">
                <StackedAreaChart series={queuedMessages} colors={['#008FFB', '#00E396', '#CED4DC']} dataOptions={{title: "Queued Messages", xaxis:{type:"datetime"}, yaxis:{type:"number"}}} height={300}/>
                <StackedAreaChart series={messages} dataOptions={{title: "Messages", xaxis:{type:"datetime"}, yaxis:{type:"number"}}} height={300}/>
                <StackedAreaChart series={traffic} colors={['#008FFB', '#00E396']} dataOptions={{title: "Traffic Volume", xaxis:{type:"datetime"}, yaxis:{type:"number"}}} height={300}/>
            </div>
            <div className="w-100 h-80">
                <Example/>
            </div>
            <div className="gap-10 pl-5">
                <Queues data={queues}/>
            </div>
        </div>
    );
};
