import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import CollectionCard from "@elements/Profile/CollectionCard";
import AuthContext from "@contexts/Auth/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingIcon from "@static/svg/LoadingIcon";
import { respondTo } from "@styles/styledMediaQuery";
import useIsTabletOrMobile from "@utils/useIsTabletOMobile";
import bread from "@utils/bread";
import CardSectionContainer from "@elements/Default/CardSectionContainer";
import Wrapper from "@elements/ProfileRedesign/Wrapper";
import { getBackend } from "@utils/network";

const Container = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	padding: 1.5rem 0.75rem;
	padding-top: 4.5rem;
	gap: 1.25rem;
	${respondTo.md`
		position: relative;
		max-width: 95vw;
		overflow: auto;
		padding: 1.5rem 2rem;
	`}
`

const LoadingContainer = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	place-items:center;
`

const CollectionsSection = () => {
	const { auth } = useContext(AuthContext)
	const { id } = useParams()
	const userID = id ? id : auth?.address
	const [cards, setCards] = useState(JSON.parse(localStorage.getItem("collections")) || [])
	const [isLoading, setIsLoading] = useState(true)
	const isTabletOrMobile = useIsTabletOrMobile();
	useEffect(() => {
		// const backend = `https://coralmarketplacesystems.xyz`;
		/*
		{
			id: "GGHhLhgdCMM734MW529X",
			data: {
				description: "Procedurally Generated Planets",
				owner: "5FYmfz6QSbwQZ1MrYLhfdGVADmPyUZmE8USLBkYP4QmgkgDA",
				image: "ipfs://bafybeifiqxmz77vt2xyefpmyiyh365cegitejl4yzr57uxnev5bzxdfkym/logo.png",
				name: "CryptoSpheres",
				created: 1636380746338
			}
		},
		*/
		axios.get(`${getBackend ()}/collection/by-user/${userID}`)
			.then((res) => {
				// console.log (res.data);
				let arr = res.data.map (item => {
					return {
						src: item.logo,
						title: item.name,
						link: `${window.location.origin}/collections/${item.id}`,
					}
				})
				// localStorage.setItem("collections", JSON.stringify(res.data.collections))
				setCards(arr);
			})
			.catch(err => {
				bread(err.response.data.error)
			})
			.finally(() => {
				setIsLoading(false)
			})
		//eslint-disable-next-line
	}, [])
	return (
		<Wrapper>
			{isTabletOrMobile ? (
				<>
					{isLoading ? (
						<LoadingContainer>
							<LoadingIcon />
						</LoadingContainer>
					) : (
						<Container>
							{cards.map((item, index) => (
								<CollectionCard key={index} {...item} fullHeight={index === 0 && true} />
							))}
						</Container>
					)}
				</>
			) : (
				<>
					{isLoading ? (
						<LoadingContainer>
							<LoadingIcon />
						</LoadingContainer>
					) : (
						<CardSectionContainer>
							{cards.map((item, index) => (
								<>
									<CollectionCard key={index} {...item} fullHeight={index === 0 && true} />
								</>
							))}
						</CardSectionContainer>
					)}
				</>
			)}
		</Wrapper>
	)
}

export default CollectionsSection
