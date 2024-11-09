import { Box, Button, Stack, Typography, Paper, IconButton, useTheme } from "@mui/material";
import React, { useState } from "react";
import WidgetsPaper from "commons/template/Paper";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomDocumentPagination from "../../molecules/CustomDocumentsPagination";
import OutlinedArchiveIcon from "../../atoms/icons/OutlinedArchive";
import ArchiveIcon from "../../atoms/icons/Archive";
import { useParams, useSearchParams } from "react-router-dom";
import BackButton from "../../molecules/buttons/Back";

const Document = ({ pageIDs = [1, 2, 3] }) => {
	const fsmId = parseInt(useParams().fsmId);
	const theme = useTheme();
	const [searchParams, setSearchParams] = useSearchParams();
	const documentId = searchParams.get('document');

	const goToDocuments = () => {
		setSearchParams({
			dialog: 'documents',
		})
	}

	const [currentPage, setCurrentPage] = useState(1);

	return (
		<Stack width={'100%'} height={`calc(100vh - ${theme.spacing(8)})`} component={Paper} maxWidth='md' padding={2} spacing={2} position={'relative'}>
			<Stack alignItems={'center'} justifyContent={'center'} direction={'row'}>
				<Box position={'absolute'} top={2} left={8}>
					<BackButton destination={`/court/${fsmId}/`} />
				</Box>

				<Stack alignItems={'center'} direction={'row'} spacing={0.5}>
					<ArchiveIcon />
					<Typography variant="h5">
						{'نام سند'}
					</Typography>
				</Stack>

				<Box position={'absolute'} top={4} right={4} padding={1}>
					<Button startIcon={<OutlinedArchiveIcon />} onClick={goToDocuments}>
						<Typography
							variant="h6"
							sx={{ fontSize: "18px", fontWeight: 800, color: "white" }}
						>
							بایگانی
						</Typography>
					</Button>
				</Box>
			</Stack>

			<Stack
				spacing={2}
				height={'100%'}
				paddingX={1}
				sx={{
					overflowY: 'auto',
					overflowX: 'hidden',
					'::-webkit-scrollbar': {
						height: '8px',
					},
					'::-webkit-scrollbar-thumb': {
						backgroundColor: '#b0bec5',
						borderRadius: '4px',
					},
					'::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#90a4ae',
					},
				}}>
				<WidgetsPaper mode="general" paperId="27" />
			</Stack>

			<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 42,
						width: 42,
						borderRadius: "100%",
						backgroundClip: "padding-box",
						position: "relative",
						overflow: "hidden",
						background: "linear-gradient(to right, #FE9C42, #E25100)",
						visibility: (currentPage > 1 ? "visible" : "hidden"),
					}}
				>
					<IconButton
						sx={{
							height: 40,
							width: 40,
							borderRadius: "100%",
							backgroundColor: "#130e15",
							backgroundClip: "padding-box",
							color: "#FE9C42",
						}}
						onClick={() => setCurrentPage(currentPage - 1)}
					>
						<ArrowForwardIcon />
					</IconButton>
				</Box>

				<CustomDocumentPagination numberOfPages={3} currentPage={currentPage} setCurrentPage={setCurrentPage} />

				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 42,
						width: 42,
						borderRadius: "100%",
						backgroundClip: "padding-box",
						position: "relative",
						overflow: "hidden",
						background: "linear-gradient(to right, #FE9C42, #E25100)",
						visibility: (currentPage < pageIDs.length ? "visible" : "hidden"),
					}}
				>
					<IconButton
						sx={{
							height: 40,
							width: 40,
							borderRadius: "100%",
							backgroundColor: "#130e15",
							backgroundClip: "padding-box",
							color: "#FE9C42",
						}}
						onClick={() => setCurrentPage(currentPage + 1)}
					>
						<ArrowBackIcon />
					</IconButton>
				</Box>
			</Stack>
		</Stack>
	);
}

export default Document;