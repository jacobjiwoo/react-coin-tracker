import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 30px;
  margin: 0px auto;
  max-width: 500px;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
`;
const Title = styled.h1`
  color: ${props => props.theme.accentColor};
  font-size: 50px;
  font-weight: bold;
`;
const CoinsList = styled.ul`
  display: flex;
  flex-direction: column;

`;
const Coin = styled.li`
    background-color: ${props => props.theme.textColor};
    color: ${props => props.theme.bgColor};
    margin-bottom: 20px;
    border-radius: 15px;
    a {
        display: flex;
        align-items: center;
        transition: color 0.2s ease-in;
        padding: 10px;
    }
    &:hover {
        a {
            color: ${props => props.theme.accentColor};
        }
    }
`;
const Loader = styled.span`
  display: block;
  text-align: center;  
`;
const Img = styled.img`
    width: 35px; height: 35px;
    margin-right: 10px;
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom(prev => !prev)
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 20));
      setLoading(false);
    })();
  }, []);
  return (
    <Container>
      <Helmet>
        <title>Crypto</title>
      </Helmet>
      <Header>
        <Title>Crypto</Title>
        <button onClick={toggleDarkAtom}>toggle</button>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {coins.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                {coin.name}({coin.symbol})&rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;