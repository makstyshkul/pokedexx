import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

export default function ShowAllStats({ pokemon }) {
	return (
		<Box
			style={{
				border: '1px solid #000',
				width: '250px',
				padding: '15px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
			}}
		>
			{console.log(pokemon)}
			<img alt={pokemon.name} width={'150px'} height={'150px'} src={pokemon.src} />
			<Grid item direction={'row'} display={'flex'}>
				<Typography textAlign={'center'} variant='h5'>{pokemon.name}</Typography>
				<Typography textAlign={'center'} variant='h5' ml={'5px'}> #{pokemon.id}</Typography>
			</Grid>
			<table style={{ borderCollapse: 'collapse', width: '100%' }}>
				<thead>
					<tr>
						<th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Type</th>
						<th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>{pokemon.types.join(', ')}</th>
					</tr>
				</thead>
				<tbody>
					{pokemon.statsName.map((statName, index) => (
						<tr key={index}>
							<td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>{statName}</td>
							<td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>{pokemon.stats[index]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Box>
	);
}
