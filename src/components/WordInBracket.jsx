const WordInBracket = ({ kalimat }) => {
  return (
    <span className="mx-1">
      <span>(</span>
      <span className="text-sm text-gray-400 mx-1">{kalimat}</span>
      <span>)</span>
    </span>
  );
};

export default WordInBracket;
