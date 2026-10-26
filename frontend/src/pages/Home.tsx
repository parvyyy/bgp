import ConnectFour from '../components/ConnectFour'
import Introduction from '../components/Introduction'
import Page from '../components/Page'

function Home() {
  return (
    <Page>
      <div className="flex flex-col items-center gap-16 text-center ">
        <Introduction />
        <ConnectFour />
      </div>
    </Page>
  )
}

export default Home
