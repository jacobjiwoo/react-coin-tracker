import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";


const Container = styled.div`
    border: 1px solid red;
`;
const InfoScreen = styled.div`
    border: 1px solid blue;
    height: 100px;
`
const Tabs = styled.div`
    border: 1px solid blue;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 20px 0px;
`;
const Tab = styled.div<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 10px 0px;
    cursor: pointer;
    color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.textColor};
`;

interface ContextProps {
    coinId: string;
}
interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      }
    }
  }

function Price() {
    const context = useOutletContext<ContextProps>()

    const [loading, setLoading] = useState(true);
    const [priceInfo, setPriceInfo] = useState<PriceData>();
    const [curPrice, setCurPrice] = useState(0);
    const [curRate, setCurRate] = useState(0);
    const changeRate = (rate?: number) => {
        (rate === undefined) ? setCurRate(0) : setCurRate(rate);
    }
    useEffect(() => {
        (async () => {
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${context.coinId}`)
                ).json();
                setPriceInfo(priceData);
                setCurPrice(Number(priceInfo?.quotes.USD.price.toFixed(2)));
                setLoading(false);
            })();
        }, [context.coinId]);
    return (
        <Container>
            <InfoScreen>
                {loading ? (
                    "Loading..."
                ) : (
                    `현재 가격 : ${curPrice} 변화율 : ${(curPrice * curRate/100)} (${curRate})`
                )}
            </InfoScreen>
            <Tabs>
                <Tab onClick={() => changeRate(priceInfo?.quotes.USD.percent_change_24h)} isActive={true}>1d</Tab>
                <Tab onClick={() => changeRate(priceInfo?.quotes.USD.percent_change_7d)} isActive={true}>7d</Tab>
                <Tab onClick={() => changeRate(priceInfo?.quotes.USD.percent_change_30d)} isActive={true}>1m</Tab>
                <Tab onClick={() => changeRate(priceInfo?.quotes.USD.percent_change_1y)} isActive={true}>1y</Tab>
            </Tabs>
        </Container>
    );
}

export default Price;