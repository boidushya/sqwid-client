import { DropdownHelp } from '@elements/Default/Dropdown';
import AlertIcon from '@static/svg/AlertIcon';
import useIsTabletOrMobile from '@utils/useIsTabletOMobile';
import React, { useState } from 'react'
import styled from 'styled-components';

const BtnContainer = styled.div`
	display: grid;
	place-items:center;
	cursor: pointer;
	z-index: 0;
	&:hover{
		svg{
			color: var(--app-container-text-primary-hover);
		}
	}
	svg{
		width: 1.25rem;
		height: 1.25rem;
		color: var(--app-container-text-primary);
		transition: color 0.2s ease;
		position: relative;
    	z-index: 5;
	}
`


const InfoBtn = () => {
	const isTabletOrMobile = useIsTabletOrMobile();
	const [helpIsVisible, setHelpIsVisible] = useState(false);
	return (
		<BtnContainer
			onMouseOver={() => setHelpIsVisible(true)}
			onMouseOut={() => setHelpIsVisible(false)}
		><AlertIcon />
			{!isTabletOrMobile &&
				<DropdownHelp
					isVisible={helpIsVisible}
					setIsVisible={setHelpIsVisible}
					options={[{
						name: "Terms of Service",
						link: "/terms-of-service"
					}, {
						name: "Privacy Policy",
						link: "/privacy-policy"
					}]}
				/>
			}
		</BtnContainer>
	)
}

export default InfoBtn