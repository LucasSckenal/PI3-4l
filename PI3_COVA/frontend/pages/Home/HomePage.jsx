import SimpleModal from "../../components/SimpleModal/SimpleModal";

const HomePage = () => {
  return (
    <div>
      <p>Homepage todo</p>

      <SimpleModal
        title={"Hello"}
        Text={"Sim"}
        Text2={"Cancelar"}
        textColor={"var(--Confirmation)"}
        textColor2={"var(--Decline)"}
        borderColor={"1px solid var(--Confirmation)"}
        borderColor2={"1px solid var(--Decline)"}
      />
    </div>
  );
};

export default HomePage;
