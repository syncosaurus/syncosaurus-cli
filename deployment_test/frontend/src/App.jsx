import './App.css';
import { mutators } from './utils/mutators';
import Reflect from './utils/reflect';
import { useSubscribe } from './utils/react.js';

//create an instance of the reflect class, known as a client
const r = new Reflect({
	mutators,
});

const incrementKey = 'count';

function App() {
	const handleIncrementClick = () => {
		r.mutate.increment({ key: incrementKey, delta: 1 });
	};

	const handleDecrementClick = () => {
		r.mutate.decrement({ key: incrementKey, delta: 1 });
	};

	const cache = useSubscribe(r, incrementKey, { [incrementKey]: 0 });

	return (
		<div>
			<div>{cache[incrementKey]}</div>
			<button onClick={handleIncrementClick}>GROW</button>
			<button onClick={handleDecrementClick}>SHRINK</button>
		</div>
	);
}

export default App;
