import {StackedAreaChart} from "@/components/StackedAreaChart";
import {data} from "@/data/chart_data";
import LineChart from "@/components/LineChart";

const Report = ({title, data}) => {
    return (
        <div>
            <div className="text-gray text-md">{title}</div>
            <div className="text-4xl pt-1">{data}</div>
        </div>
    )
}
const main = () => {
    let lineData = [
        { date: 20220101, impressions: 100 },
        { date: 20220102, impressions: 120 },
    ];
  return (
      <div>
          <h1 className="text-3xl font-semibold">Test Server 2 <span className="font-normal text-base">@ 192.168.1.64</span></h1>
          <div className="flex flex-wrap gap-20 pt-4 justify-between">
              <Report title="Total Messages In" data="337.51m" />
              <Report title="Total Messages Out" data="345.99m" />
              <Report title="Total Data Volume In" data="60.94GB" />
              <Report title="Total Data Volume Out" data="62.46GB" />
              <Report title="Message In Rate" data="1.37k" />
              <Report title="Message Out Rate" data="1.89k" />
              <Report title="Incoming Data Rate" data="247.61KB/s" />
              <Report title="Outgoing Data Rate" data="337.94KB/s" />
          </div>
          <div className="grid lg:grid-cols-2 pt-10 gap-10">
              <StackedAreaChart width="500" height={200} data={data}/>
              <StackedAreaChart width="500" height={200} data={data}/>
          </div>
          <div className="grid lg:grid-cols-2 pt-10 gap-10 px-10">
              <div className="flex flex-wrap gap-20 pt-4 justify-between">
                  <Report title="Connections" data="2" />
                  <Report title="Channels" data="8" />
                  <Report title="Exchanges" data="10" />
                  <Report title="Queues" data="10" />
                  <Report title="Consumers" data="5" />
              </div>
              <div className="flex flex-wrap gap-20 pt-4 justify-between">
                  <Report title="Connections" data="2" />
                  <Report title="Channels" data="8" />
                  <Report title="Exchanges" data="10" />
                  <Report title="Queues" data="10" />
                  <Report title="Consumers" data="5" />
              </div>
          </div>
      </div>
  );
};

export default main;
