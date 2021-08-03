
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export async function getStaticProps() {
  const res = await fetch("https://sheet.best/api/sheets/fe3d2f14-0e9c-4448-901a-b850c22c0ab8")
  const data = await res.json();
  const allExerciseData = data;
  console.log(allExerciseData);
  return {
    props: {
      allExerciseData
    }
  }
}

export default function Home({allExerciseData}) {
  return (
    <Layout home>

      <button class="button btn-dark">Kérek egy edzéstervet!</button>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Minden gyakorlat:</h2>

        <table class="table table-striped" >
          <thead>
            <tr>
              <th >izomcsoport</th>
              <th >feladat</th>
              <th >nehézség</th>
              <th >orientáció</th>
            </tr>
          </thead>
          <tbody>
          {allExerciseData.map(({ izomcsoport, feladat, nehezseg , orientacio }) => (
            
              <tr class>
                <td>{izomcsoport}</td> 
                <td>{feladat}</td>
                <td>{nehezseg}</td>
                <td>{orientacio}</td>
              </tr>
            

          ))}
        </tbody>
        </table>
      </section>

    </Layout>
  )
}