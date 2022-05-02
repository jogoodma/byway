import { Form } from "remix";
import { BywayMatches } from "~/pico/matcher.server";

export type ResultCardsProps = {
  matches: Array<BywayMatches>;
};

const ResultCards = ({ matches = [] }: ResultCardsProps) => {
  return (
    <section className="flex gap-20 flex-wrap">
      {matches.map((match) => (
        <div key={match.id} className="card w-80 bg-gray-200 shadow-xl">
          <figure></figure>
          <div className="card-body">
            <h2 className="card-title">{match.name}</h2>
            <p>{match.description}</p>
            <div className="flex flex-wrap gap-2">
              {match.tags.map((tag) => (
                <div key={tag} className="badge badge-md">
                  {tag}
                </div>
              ))}
            </div>
            <p className="text-black font-bold">${match.price}</p>
            <div className="card-actions justify-end">
              <Form method="post" action="/requests/new" reloadDocument>
                <input
                  type="hidden"
                  name="request"
                  value={JSON.stringify(match)}
                />
                <button className="btn btn-primary" type="submit" role="submit">
                  Buy
                </button>
              </Form>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ResultCards;
