import Home from './pages/Home';
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import Table from './pages/Table';

function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-row w-full'>
        <div className='w-2/12 h-screen'>
          <div className='w-100 h-screen bg-gray-300 flex flex-col px-5 fixed'>
            <div className='text-gray-800 text-3xl my-10 font-extrabold'>Guest App</div>
            <Link className='text-gray-600 hover:text-gray-800 hover:bg-gray-200 p-1' to='/'>Table List</Link>
            <Link className='text-gray-600 hover:text-gray-800 hover:bg-gray-200 p-1' to='/guest'>Guest List</Link>
          </div>
        </div>
        <Switch>
          <Route exact key={1} path="/" component={Table} />
          <Route exact key={2} path="/guest" component={Home} />
          <Redirect
            exact
            from="**"
            to={"/"}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
