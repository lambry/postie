import { __ } from '@wordpress/i18n'
import { Button, ButtonGroup } from '@wordpress/components'
import { breakpointOptions } from './options'

export default function Breakpoints({ active, setActive, children }) {
	return (
		<div className='postie-breakpoints'>
			<ButtonGroup className='postie-breakpoints-options'>
				{breakpointOptions.map(({ value, label }) => (
					<Button key={value} onClick={() => setActive(value)} variant={active === value ? 'link': ''} className={active === value ? 'is-active': ''} isSmall>
						{label}
					</Button>
				))}
			</ButtonGroup>
			{children}
		</div>
	)
}
