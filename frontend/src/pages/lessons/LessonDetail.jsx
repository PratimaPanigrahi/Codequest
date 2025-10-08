import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../utils/tokenHelper";

const LessonDetail = () => {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Find level by id
        const allLevels = res.data.lessons.flatMap((lesson) => lesson.levels);
        const foundLevel = allLevels.find((lvl) => lvl._id === id);
        setLevel(foundLevel);
      } catch (err) {
        console.error(err);
        alert("Level not found");
      }
    };

    fetchLevel();
  }, [id]);

  if (!level) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{level.title}</h2>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2196f3",
            color: "#fff",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Start
        </button>
      ) : (
        <iframe
          src={`/notes/${level.slide}`}
          title={level.title}
          width="100%"
          height="600px"
          style={{ border: "1px solid #ccc", marginTop: "15px" }}
        />
      )}
    </div>
  );
};

export default LessonDetail;
