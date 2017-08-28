const cost = {
	structures: {
		mobileStation: {
			therodite: 25, 
			oxytrite: 15, 
			ikredein: 10, 
			embryan: 10, 
			odium: 5, 
			sybril: 0
		}, 
		warpGate: {
			therodite: 0, 
			oxytrite: 10, 
			ikredein: 0, 
			embryan: 0, 
			odium: 10, 
			sybril: 15
		},
		beacon: {
			therodite: 15, 
			oxytrite: 10, 
			ikredein: 0, 
			embryan: 5, 
			odium: 5, 
			sybril: 5
		}, 
		barge: {
			therodite: 25, 
			oxytrite: 0, 
			ikredein: 20, 
			embryan: 5, 
			odium: 15, 
			sybril: 0
		}
	}, 
	military: {
		mineField: {
			therodite: 5, 
			oxytrite: 5, 
			ikredein: 15, 
			embryan: 0, 
			odium: 10, 
			sybril: 0
		}
	}, 
	other: {
		bargeRecalibrate: {
			therodite: 0, 
			oxytrite: 0, 
			ikredein: 0, 
			embryan: 0, 
			odium: 0, 
			sybril: 5
		}
	}
}
var canAfford = function(producT) {
	for (i in cost) {
		for (j in cost[i][producT]) {
			if (inventory.refined[j].value < cost[i][producT][j]) {
				return false;
			}
		}
	}
	return true;
};