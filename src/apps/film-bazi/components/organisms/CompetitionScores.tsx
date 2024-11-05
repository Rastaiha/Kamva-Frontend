import React, { Fragment } from "react";
import { Box, Grid } from "@mui/material";
import WinnerCard from "../molecules/WinnerCard";
import ScoreRecord from "../molecules/ScoreRecord";
import ScoreRecordSkeleton from "../molecules/ScoreRecordsSkeleton";
import WinnerCardsSkeleton from "../molecules/WinnerCardsSkeleton";

export default function CompetitionScores({ allScores, winnerScores }) {
	
	return (
		<Box
			sx={{
				height: "auto",
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					textAlign: 'center',
					marginTop: "40px"
				}}
			>
				<Grid
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{winnerScores.length > 0 ?
						<Fragment>
							<Grid>
								<WinnerCard score={winnerScores[2]?.score} rank={3} />
							</Grid>
							<Grid>
								<WinnerCard score={winnerScores[0]?.score} rank={1} />
							</Grid>
							<Grid>
								<WinnerCard score={winnerScores[1]?.score} rank={2} />
							</Grid>
						</Fragment> :
						<WinnerCardsSkeleton />
					}
				</Grid>
			</Box>
			<Grid
				sx={{
					display: "flex",
					justifyContent: "center",
					width: '100%',
					marginBottom: "10px"
				}}
				container
			>
				{allScores.winnerUsersInfo.length > 0 ?
					allScores.winnerUsersInfo.map((record, index) => (
						<ScoreRecord key={record.id} rank={index + 1} first_name={record.first_name} last_name={record.last_name} score={record.score} currentUser={record.currentUser} id={record.id} />
					)) :
					<ScoreRecordSkeleton />
				}
				{(allScores.currentUser != null && allScores.winerUsresInfo && !allScores.currentUserExistsInWinners) &&
					<>
						<Box sx={{ marginTop: 2, marginBottom: 2 }}>
							<Box sx={{ backgroundColor: "white", borderRadius: "50%", width: "10px", height: "10px", margin: "2px" }} />
							<Box sx={{ backgroundColor: "white", borderRadius: "50%", width: "10px", height: "10px", margin: "2px" }} />
							<Box sx={{ backgroundColor: "white", borderRadius: "50%", width: "10px", height: "10px", margin: "2px" }} />
						</Box>
						<ScoreRecord key={allScores.currentUser.id} rank={allScores.currentUser.rank} first_name={allScores.currentUser.first_name} last_name={allScores.currentUser.last_name} score={allScores.currentUser.score} currentUser={allScores.currentUser.currentUser} id={allScores.currentUser.id} />
					</>
				}
			</Grid>
		</Box>
	);
}