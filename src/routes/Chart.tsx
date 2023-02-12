import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const Loader = styled.span`
  display: block;
  text-align: center;
`;
// interface
interface ContextProps {
  coinId: string;
}
interface IHistorical {
  close: string;
  high: string;
  low: string;
  market_cap: number;
  open: string;
  time_close: number;
  time_open: number;
  volume: string;
}
function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const context = useOutletContext<ContextProps>();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IHistorical[]>([]);
  useEffect((() => {
    (async () => {
      const response = await fetch(`https://ohlcv-api.nomadcoders.workers.dev?coinId=${context.coinId}`);
      const json = await response.json();
      setData(json);
      setLoading(false);
    })();
  }), [context.coinId])
  return (
    <div>
      {loading ? (
        <Loader>Loading chart...</Loader>
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map(price => Number(price.close)) as number[]
            }
          ]}
          options={{
            chart: {
              width: 500,
              height: 500,
              background: "transparent",
              toolbar: {
                show: false
              }
            },
            theme: {
              mode: isDark ? "dark" : "light",
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            colors: ["#55E6C1"],
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: true },
              labels: { show: true },
              type: "datetime",
              categories: data?.map(price => price.time_close) as number[]
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`
              }
            }
          }}
        />
      )}
    </div>
  );
}
export default Chart;