import { createContext, useContext, useState } from "react";
import {format, fromUnixTime} from "date-fns";
import {HttpClient} from "@/helpers/api";
import {humanFileSize} from "@/helpers/string";

export const WorkerContext = createContext({});

export const WorkerProvider = ({ children, defaultWorker }) => {
    const [metrics, setMetrics] = useState({})
    const [counters, setCounters] = useState()
    const [serverInfo, setServerInfo] = useState()
    const [queuedMessages, setQueuedMessages] = useState([])
    const [queues, setQueues] = useState([])
    const [connections, setConnections] = useState([])
    const [exchanges, setExchanges] = useState([])
    const [consumers, setConsumers] = useState([])
    const [channels, setChannels] = useState([])
    const [messages, setMessages] = useState([])
    const [traffic, setTraffic] = useState([])

    const updateMetrics = (data) => {
        let metricsData = data ? data : [];
        let mt = {}
        let qs = []
        let ms = []
        let ts = []
        metricsData.forEach((metric) => {
            let name = metric.name.replaceAll('server.', '')
            /*if (metric.name === 'server.traffic_in' || metric.name === 'server.traffic_out') {
                metric.sample = metric.sample.map((sample) => {
                    if (sample) {
                        sample.value = humanFileSize(sample.value) + "/s"
                    }
                    return sample
                })
            }*/
            mt[name] = {
                sample: metric.sample,
                value: metric.value,
            }
            // format(fromUnixTime(metric.timestamp), 'MMM-d, h:M:s')
            if (['total', 'unacked', 'ready'].includes(name)) {
                qs = [...qs, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample?.value,
                        timestamp: sample?.timestamp
                    }
                })]
            } else if (['acknowledge', 'get', 'confirm', 'deliver', 'publish'].includes(name)) {
                ms = [...ms, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample?.value,
                        timestamp: sample?.timestamp
                    }
                })]
            } else if (['traffic_in', 'traffic_out'].includes(name)) {
                ts = [...ts, ...metric.sample.map((sample) => {
                    return {
                        name: name,
                        value: sample?.value,
                        timestamp: sample?.timestamp
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
    const updateOverview = (data) => {
        if(data.hasOwnProperty('metrics')) {
            updateMetrics(data.metrics)
        }
        if(data.hasOwnProperty('server_info')) {
            setServerInfo(data.server_info)
        }
        if(data.hasOwnProperty('counters')) {
            setCounters(data.counters)
        }
        if(data.hasOwnProperty('queues')) {
            setQueues(data.queues?.items || [])
        }
        if(data.hasOwnProperty('connections')) {
            setConnections(data.connections?.items || [])
        }
        if(data.hasOwnProperty('channels')) {
            setChannels(data.channels?.items || [])
        }
        if(data.hasOwnProperty('consumers')) {
            setConsumers(data.consumers?.items || [])
        }
        if(data.hasOwnProperty('exchanges')) {
            setExchanges(data.exchanges?.items || [])
        }
    }
    const getOverview = () => {
        HttpClient.get("/overview").then(response => {
            updateOverview(response.data)
        })
    }
    const value = {
        metrics,
        counters,
        serverInfo,
        queuedMessages,
        queues,
        messages,
        traffic,
        consumers,
        channels,
        connections,
        exchanges,
        updateMetrics,
        getOverview,
        updateOverview,
        setQueues,
        setConnections,
        setConsumers,
        setExchanges,
        setChannels
    }
    return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
};

export const useWorker = () => useContext(WorkerContext)
