// in main.tsx

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={rootLoader}>
      <Route index element={<Home />} />
      <Route path="hero/:id" element={<HeroProfile />} loader={heroProfileLoader} />
    </Route>
  )
)



// in Root.tsx

export async function loader() {
  // fetching
  console.log("root loader")
  return [] as Hero[]
}

const Root = () => {
  const allHeroes = useLoaderData()
  const setHeroes = useStore(state => state.setHeroes)

  console.log("we rendering root")
  // saving the fetched heroes to a zustand store, on startup only
  useEffect(() => {
    console.log("we setting heroes store")
    setHeroes(allHeroes);
  }, [allHeroes, setHeroes]);

  return (
    <div className='flex w-full'>
      <Sidebar allHeroes={allHeroes} />
      <div>
        <Outlet />
      </div>
    </div>
  )
}



// in HeroProfile.tsx

export async function loader({ params }: LoaderFunctionArgs) {
  // fetching more data
  console.log("hero profile loader")
  return { data: null, heroId: params.id }
}

const HeroProfile = () => {
  let { data, heroId } = useLoaderData()
  let heroes = useStore(state => state.heroes)
  // heroes is undefined here when we try to enter the website from this route

  console.log("we rendering profile")

  return (
    <div>whatever</div>
  )
}