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
        let qs = []
        let ms = []
        let ts = []
        metricsData.forEach((metric) => {
            let name = metric.name.replaceAll('server.', '')
            if (metric.name === 'server.traffic_in' || metric.name === 'server.traffic_out') {
                metric.sample = metric.sample.map((sample) => {
                    if (sample) {
                        sample.value = humanFileSize(sample.value) + "/s"
                    }
                    return sample
                })
            }
            mt[name] = {
                sample: metric.sample,
                value: metric.value,
            }
            // format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s')
            if (['total', 'unacked', 'ready'].includes(name)) {
                qs = [...qs, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample.value,
                        timestamp: sample.timestamp
                    }
                })]
            } else if (['acknowledge', 'get', 'confirm', 'deliver', 'publish'].includes(name)) {
                ms = [...ms, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample.value,
                        timestamp: sample.timestamp
                    }
                })]
            } else if (['traffic_in', 'traffic_out'].includes(name)) {
                ts = [...ts, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample.value,
                        timestamp: sample.timestamp
                    }
                })]
            }

        })
        const msg = Object.groupBy(ms, product => product.timestamp)
        const qsg = Object.groupBy(qs, product => product.timestamp)
        const tsg = Object.groupBy(ts, product => product.timestamp)
        let msa = []
        let qsa = []
        let tsa = []
        for (const key in msg) {
            let tmp = {name: format(fromUnixTime(key), 'hh:MM:ss')}
            msg[key].forEach(d => {
                tmp[d.name] = d.value
            })
           msa.push(tmp)
        }
        for (const key in qsg) {
            let tmp = {name: format(fromUnixTime(key), 'hh:MM:ss')}
            qsg[key].forEach(d => {
                tmp[d.name] = d.value
            })
           qsa.push(tmp)
        }
        for (const key in tsg) {
            let tmp = {name: format(fromUnixTime(key), 'hh:MM:ss')}
            tsg[key].forEach(d => {
                tmp[d.name] = d.value
            })
           tsa.push(tmp)
        }
        setQueuedMessages(qsa)
        setMessages(msa)
        setTraffic(tsa)
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
                }, 100)
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
                <div>
                    <h1>Queued Messages</h1>
                    <div className="h-80">
                        <StackedAreaChart series={queuedMessages} options={{xaxis: {field: "name"}, fields: [{name: "total", color: "#00E396"}, {name: "ready", color: "#008FFB"}, {name: "unacked", color: "#CED4DC"},]}}/>
                    </div>
                </div>
                <div>
                    <h1>Message Rate</h1>
                    <div className="h-80">
                        <StackedAreaChart series={messages} options={{xaxis: {field: "name"}, fields: [{name: "publish", color: "#00E396"}, {name: "acknowledge", color: "#F0E396"}, {name: "deliver", color: "#DAA396"}, {name: "confirm", color: "#008FFB"}, {name: "get", color: "#CED4DC"},]}}/>
                    </div>
                </div>
                <div>
                    <h1>Traffic Rate</h1>
                    <div className="h-80">
                        <StackedAreaChart series={traffic} options={{xaxis: {field: "name"}, fields: [{name: "traffic_in", color: "#00E396"}, {name: "traffic_out", color: "#F0E396"}]}}/>
                    </div>
                </div>
            </div>
            <div className="gap-10 pl-5">
                <Queues data={queues}/>
            </div>
        </div>
    );
};
