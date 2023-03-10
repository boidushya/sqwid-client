import DottedHeading from "@elements/Default/DottedHeading";
import React from "react";
import styled from "styled-components";
import { respondTo } from "@styles/styledMediaQuery";

const Wrapper = styled.div`
	padding: 0 6rem;
	min-height: 70vh;
	max-width: 90rem;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	${respondTo.md`
		padding: 0;
		h1{
			padding-left: 3rem;
		}
	`}
`;

const Container = styled.div`
	width: 100%;
`;

const CollectionsPage = () => {
	// eslint-disable-next-line no-unused-vars
	const [collections, setCollections] = React.useState([
		{
			id: 1,
			name: "Collection 1",
			description: "Collection 1 description",
			cover: "https://picsum.photos/200/200",
			owner: {
				id: 1,
				name: "Owner 1",
				avatar: "https://picsum.photos/200/200",
			},
		},
	]);
	return (
		<>
			<Wrapper>
				<Container>
					<DottedHeading size="2.5rem">Collections</DottedHeading>
					{collections.map(collection => (
						<div key={collection.id}>
							<h1>{collection.name}</h1>
							<p>{collection.description}</p>
							<img src={collection.cover} alt={collection.name} />
							<p>{collection.owner.name}</p>
							<img src ={collection.owner.avatar} alt={collection.owner.name} />
						</div>
					))}
				</Container>
			</Wrapper>
		</>
	);
};

export default CollectionsPage;
