import {StackedAreaChart} from '@/components/charts/StackedAreaChart';
import '@/styles/app.css';
import {useEffect} from "react";
import {humanFileSize, humanNumber} from "@/helpers/string";
import {Queues} from "@/views/queues";
import {useWorker} from "@/hooks/worker";
import {useSocket} from "@/hooks/websocket";

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
    const {metrics, queuedMessages, messages, traffic, queues, serverInfo, getOverview, updateOverview} = useWorker()
    const {socket} = useSocket()

    useEffect(() => {
        getOverview()
    }, []);
    useEffect(() => {
        if (socket) {
            socket.on("overview:response", (data) => {
                updateOverview(data)
            })
        }
    }, [socket]);
    return (
        <div>
            <h1 className="text-3xl font-semibold">
                <span>{serverInfo?.name} <span className="font-normal text-base">@ {serverInfo?.url}</span></span>
                <span className="font-bold text-base pl-2">
                    <span className="inline-block w-60">CPU Usage: <span className="text-gray-500" title="Total PID CPU Usage">{serverInfo?.stats.pid.cpu.toFixed(1)}%</span> / <span className="text-gray" title="Total OS CPU Usage">{serverInfo?.stats.os.cpu.toFixed(1)}%</span></span>
                    <span className="pl-2">Memory Usage: <span className="text-gray-500" title="Total PID Memory Usage">{humanFileSize(serverInfo?.stats.pid.ram)}</span> / <span className="text-gray" title="Total OS Memory Usage">{humanFileSize(serverInfo?.stats.os.ram)}</span> / <span className="text-gray" title="Total Memory Available">{humanFileSize(serverInfo?.stats.os.total_ram)}</span></span>
                </span>
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
                    <h1>Traffic Rate (in Bytes/s)</h1>
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
