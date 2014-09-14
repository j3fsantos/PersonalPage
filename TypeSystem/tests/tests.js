if ((_runtime.myin($x_4, ['q1']) && _runtime.myin($x_2, ['p1']) || _runtime.myin($x_4, ['q1']) && !_runtime.myin($x_2, [
		'p1',
		'p2'
	]) || _runtime.myin($x_4, ['q2']) && _runtime.myin($x_2, ['p1']) || !_runtime.myin($x_4, [
		'q1',
		'q2'
	]) && _runtime.myin($x_2, ['p1']) || !_runtime.myin($x_4, [
		'q1',
		'q2'
	]) && _runtime.myin($x_2, ['p2']) || !_runtime.myin($x_4, [
		'q1',
		'q2'
	]) && !_runtime.myin($x_2, [
		'p1',
		'p2'
	])) && (_runtime.myin($x_2, ['p1']) || _runtime.myin($x_2, ['p2']) || !_runtime.myin($x_2, [
		'p1',
		'p2'
	]))) {
	$x_1[$x_2] = $x_5;
} else {
	throw new Error('Illegal Runtime Operation');
}
