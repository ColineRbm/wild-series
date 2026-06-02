import { useEffect, useState } from "react";
import "./Programs.css";

type Program = {
  id: number;
  title: string;
  synopsis: string;
  poster: string;
  country: string;
  year: number;
};

function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    fetch("http://localhost:3310/api/programs")
      .then((res) => res.json())
      .then((data) => setPrograms(data));
  }, []);

  return (
    <main>
      <h1>Les Séries</h1>
      <ul className="programs-grid" style={{ listStyle: "none", padding: 0 }}>
        {programs.map((program) => (
          <li key={program.id} className="program-card">
            <img src={program.poster} alt={program.title} />
            <div className="program-card-body">
              <h2>{program.title}</h2>
              <p>{program.synopsis}</p>
              <span className="program-meta">
                {program.country} · {program.year}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Programs;
