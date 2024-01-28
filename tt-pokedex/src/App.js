import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid, Modal, Paper, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import Button from '@mui/material/Button';
import ShowAllStats from './ShowAllStats';
import CloseIcon from '@mui/icons-material/Close';


function App() {

	const [pokedexData, setPokedexData] = React.useState([]);
	const [showCards, setShowCards] = React.useState(12);
	const [selectedPokemon, setSelectedPokemon] = React.useState(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [selectedType, setSelectedType] = React.useState(null);


	React.useEffect(() => {
		axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${showCards}`)
			.then(data => {
				const pokedexNames = data.data.results.map(item => item.name);
				const pokedexURL = data.data.results.map(item => item.url);

				const promises = pokedexURL.map(url =>
					axios.get(url)
						.then(data => ({
							name: pokedexNames[pokedexURL.indexOf(url)],
							src: data.data.sprites.front_default,
							types: data.data.types.map(item => item.type.name),
							statsName: [...data.data.stats.map(item => item.stat.name), 'weight', 'total moves'],
							stats: [...data.data.stats.map(item => item.base_stat), data.data.weight, data.data.moves.length],
							id: data.data.id
						}))
				);

				Promise.all(promises)
					.then(images => {
						setPokedexData(images);
					})
					.catch(error => console.error(error));
			})
			.catch(error => console.error(error));
	}, []);

	const handleShowCards = () => {
		axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${showCards + 3}`)
			.then(data => {
				const newPokedexData = data.data.results.slice(showCards).map(item => ({
					name: item.name,
				}));

				const newPromises = data.data.results.slice(showCards).map(url =>
					axios.get(url.url)
						.then(data => ({
							name: newPokedexData.find(item => item.name === url.name).name,
							src: data.data.sprites.front_default,
							types: data.data.types.map(item => item.type.name),
							statsName: [...data.data.stats.map(item => item.stat.name), 'weight', 'total moves'],
							stats: [...data.data.stats.map(item => item.base_stat), data.data.weight, data.data.moves.length],
							id: data.data.id
						}))
				);

				Promise.all(newPromises)
					.then(newImages => {
						setPokedexData(prevData => [...prevData, ...newImages]);
						setShowCards(prevCount => prevCount + 3);
					})
					.catch(error => console.error(error));
			})
			.catch(error => console.error(error));
	};

	const handleCardClick = (pokemon) => {
		setSelectedPokemon(pokemon);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedPokemon(null);
		setIsModalOpen(false);
	};

	const handleTypeChange = (_, newType) => {
		setSelectedType(newType);
	};

	const filteredPokedexData = selectedType ? pokedexData.filter((pokemon) => pokemon.types.includes(selectedType)) : pokedexData;

	return (
		<>
			<Box>
				<Typography variant='h2' display={'flex'} justifyContent={'center'} bgcolor={'#F59794'} color={'#fff'}>Pokedex</Typography>
				<ToggleButtonGroup
					value={selectedType}
					exclusive
					onChange={handleTypeChange}
					aria-label="pokemon types"
					style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap' }}
				>
					<ToggleButton value={null} aria-label="all types">
						All Types
					</ToggleButton>
					<ToggleButton value="grass" aria-label="grass type">
						Grass
					</ToggleButton>
					<ToggleButton value="poison" aria-label="poison type">
						Poison
					</ToggleButton>
					<ToggleButton value="fire" aria-label="fire type">
						Fire
					</ToggleButton>
					<ToggleButton value="water" aria-label="water type">
						Water
					</ToggleButton>
				</ToggleButtonGroup>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="flex-start"
					spacing={2}
					mt={2}>
					{filteredPokedexData.map((pokemon, index) => (
						<Grid
							onClick={() => handleCardClick(pokemon)}
							item
							key={index}
							direction={'row'}
							xs={12}
							sm={6}
							md={4}
							style={{ cursor: 'pointer', position: 'relative' }}>
							<Box
								style={{
									border: '1px solid #000',
									width: '250px',
									height: '250px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									marginLeft: '15px'
								}}>
								<img alt={pokemon.name} width={'150px'} height={'150px'} src={pokemon.src} />
								<Typography textAlign={'center'} variant='h5'>{pokemon.name}</Typography>
								<Stack
									direction={'row'}
									spacing={2}
									mt={'10px'}
									mb={'10px'}
									mr={'10px'}>
									{pokemon.types.map((type, typeIndex) => (
										<Button key={typeIndex} variant='contained'>{type}</Button>
									))}
								</Stack>
							</Box>
						</Grid>
					))}
				</Grid>
				<Box mb={'15px'}
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px'
					}}
				>
					<Button variant='contained' onClick={handleShowCards} style={{ fontSize: '18px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '25px', paddingBottom: '15px' }}> Load More</Button>
				</Box>
			</Box >
			{selectedPokemon && (
				<Modal open={isModalOpen} onClose={handleCloseModal}>
					<Box
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}>
						<CloseIcon style={{ marginLeft: '250px', marginBottom: '-100px', cursor: 'pointer', position: 'absolute' }} onClick={handleCloseModal} />
						<Paper>
							<ShowAllStats pokemon={selectedPokemon} />
						</Paper>
					</Box>
				</Modal>
			)}
		</>
	);
}

export default App;
