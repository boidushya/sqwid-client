import { respondTo } from "@styles/styledMediaQuery";
// import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingIcon from "@static/svg/LoadingIcon";
// import RecentlyListed from "./RecentlyListed";
import { fetchMarketplaceItems } from "@utils/marketplace";
import OnSaleSection from "@elements/Explore/Sections/OnSaleSection";
import AuctionSection from "@elements/Explore/Sections/AuctionSection";
import RaffleSection from "@elements/Explore/Sections/RaffleSection";
import LoansSection from "@elements/Explore/Sections/LoansSection";
import { NavLink } from "react-router-dom";
import ChevronRight from "@static/svg/ChevronRight";

const Container = styled.div`
	padding: 0 6rem;
	min-height: 70vh;
	max-width: 90rem;
	margin: 4rem auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	${respondTo.md`
		padding: 0;
		h1{
			padding-left: 3rem;
		}
	`}
`

const Wrapper = styled.div`
	padding: 0 12rem;
`

const LoadingContainer = styled.div`
	height: 70vh;
	width: 100%;
	display: grid;
	place-items:center;
`

const Section = styled.section`
	width: 100%;
	margin: 8rem 0;
`


const Navbar = styled.nav`
	position:relative;
	display:flex;
	gap:0.5rem;
	/* border-bottom: 0.1rem solid var(--app-container-bg-primary); */
	margin-bottom: 0.5rem;
	user-select:none;
	&:after{
		content:'';
		display:block;
		margin-top: auto;
		width:100%;
		height:0.15rem;
		border-radius: 1000rem;
		background-color:var(--app-container-bg-primary);
	}
`

const Heading = styled.h1`
	line-height: 1;
	position:relative;
	margin: 0.1rem 0.5rem;
	font-size: 3rem;
	font-weight: 900;
	color: ${props => props.active ? `inherit` : `var(--app-container-text-primary)`};
	text-decoration:none;
	display: block;
	text-decoration: none;
	color: inherit;
	font-weight: 900;
	text-align:left;
	width: fit-content;
	transition: color 0.1s, transform 0.1s;
	background: var(--app-background);
	&:before{
		content: "";
		height: 100%;
		width: 100%;
		background-image: radial-gradient(hsla(240, 6%, 75%, 0.5) 0.5px, transparent 0.5px);
		background-size: calc(10 * 0.5px) calc(10 * 0.5px);
		position: absolute;
		transform: translate(-1rem, 1rem);
	}
`

const StyledNavLink = styled(NavLink)`
	position: absolute;
	right: 0;
	bottom: 0;
	margin-bottom: 0.5rem;
	display: flex;
	align-items:center;
	text-decoration: none;
	color: var(--app-container-text-primary-hover);
	font-size: 1rem;
	font-weight: 800;
	transition: color 0.2s ease;
	&:hover{
		color: var(--app-text);
	}
`

const Explore = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [onSale, setOnSale] = useState([]);
	const [auctions, setAuctions] = useState([]);
	const [raffles, setRaffles] = useState([]);
	const [loans, setLoans] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const items = await fetchMarketplaceItems();
			setOnSale(items.sale);
			setAuctions(items.auction);
			setRaffles(items.raffle);
			setLoans(items.loan);
			setIsLoading(false);
		}
		fetchData();
	}, []);
	return (
		<Section id="explore">
			{isLoading ? (
				<LoadingContainer>
					<LoadingIcon size={64} />
				</LoadingContainer>
			) : (
				<Wrapper>
					<Navbar>
						<Heading>Explore</Heading>
						<StyledNavLink to="/explore">Dive In <ChevronRight /></StyledNavLink>
					</Navbar>
					<Container>
						<OnSaleSection items={onSale} />
						<AuctionSection items={auctions} />
						<RaffleSection items={raffles} />
						<LoansSection items={loans} />
					</Container>
				</Wrapper>
			)}
		</Section>
	)
}

export default Explore;