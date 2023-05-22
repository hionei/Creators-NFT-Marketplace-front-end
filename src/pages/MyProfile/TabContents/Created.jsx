import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { getUserCollections } from "src/store/contract/actions";
import { fetchCreatedData } from "src/store/profile/actions";
import MCreatedNFTCard from "src/components/MCards/MCreatedNFTCard";

const Created = (props) => {
  const myCollections = useSelector((state) => state.contract.myCollections);
  const createdRawData = useSelector((state) => state.profile?.creator);
  const [createdData, setcreatedData] = React.useState();
  console.log("createdData", createdRawData);
  const [category, setCategory] = React.useState(-1);
  const [collection, setCollection] = React.useState(-1);
  const dispatch = useDispatch();
  console.log("collectioninfo", myCollections);

  useEffect(() => {
    dispatch(getUserCollections());
    dispatch(fetchCreatedData());
  }, []);

  useEffect(() => {
    setcreatedData(createdRawData);
  }, [createdRawData]);

  const handleChange = (event, type) => {
    console.log(type);
    switch (type) {
      case "category":
        setCategory(event.target.value);
        console.log(event.target.value, collection);

        event.target.value == -1
          ? setcreatedData(
              collection == -1
                ? createdRawData
                : createdRawData.filter(
                    (item) =>
                      myCollections[collection].id == item.nfts.contractId
                  )
            )
          : setcreatedData(
              collection == -1
                ? createdRawData.filter((item) => {
                    return Number(item.category_id) == event.target.value;
                  })
                : createdRawData.filter(
                    (item) =>
                      Number(item.category_id) == event.target.value &&
                      myCollections[collection].id == item.nfts.contractId
                  )
            );
        break;
      case "collection":
        setCollection(event.target.value);

        console.log(category, event.target.value);
        event.target.value == -1
          ? setcreatedData(
              category == -1
                ? createdRawData
                : createdRawData.filter(
                    (item) => category == Number(item.category_id)
                  )
            )
          : setcreatedData(
              category == -1
                ? createdRawData.filter(
                    (item, index) =>
                      item.nfts.contractId ==
                      myCollections[event.target.value]?.id
                  )
                : createdRawData.filter(
                    (item, index) =>
                      item.nfts.contractId ==
                        myCollections[event.target.value]?.id &&
                      category == Number(item.category_id)
                  )
            );
        break;
      default:
        break;
    }
  };
  return (
    <div className="tab-container">
      <section className="button-bar">
        <div>
          <BarSelect
            className="edit-btn"
            value={category}
            onChange={(eve) => handleChange(eve, "category")}
          >
            <MenuItem value={-1}>Category</MenuItem>
            <MenuItem value={0}>Art</MenuItem>
            <MenuItem value={1}>Music</MenuItem>
            <MenuItem value={2}>Ticket</MenuItem>
            <MenuItem value={3}>Community</MenuItem>
            <MenuItem value={4}>Moments</MenuItem>
            <MenuItem value={5}>Asset</MenuItem>
          </BarSelect>
          <BarSelect
            className="edit-btn"
            value={collection}
            onChange={(eve) => handleChange(eve, "collection")}
          >
            <MenuItem value={-1}>{"Collection"}</MenuItem>
            {myCollections.map((item, index) => {
              return (
                <MenuItem value={index} key={item.id + "collection"}>
                  {item.name}
                </MenuItem>
              );
            })}
          </BarSelect>
        </div>
      </section>
      {!createdData ? (
        <section className="content">
          <h4>No items found</h4>
          <p>
            Come back soon! Or try to browse something for you on our
            marketplace
          </p>
          <BrowseButton>Browse marketplace</BrowseButton>
        </section>
      ) : (
        <section className="item-bucket">
          {createdData.map((item, index) => (
            <MCreatedNFTCard
              history={props.history}
              data={item}
              isLoading={false}
              key={"profile" + index}
            />
          ))}
        </section>
      )}
    </div>
  );
};

const BarSelect = styled(Select)(({ theme }) => ({
  border: "1px solid #666",
  color: "#aaa",
  fontSize: "12px",
  textTransform: "none",
  borderRadius: "30px",
  padding: "0px 10px",
  margin: "5px",
  "> div": {
    padding: "4px 5px !important",
    paddingRight: "20px !important",
  },
  "&:selected": {
    outline: "none",
  },
}));

const BrowseButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#da4bfd",
  textTransform: "none",
  padding: "7px 15px !important",
  borderRadius: "30px",
  "&:hover": {
    backgroundColor: "#da4bfd",
  },
}));

const BarButton = styled(Button)(({ theme }) => ({
  color: "#aaa",
  fontSize: "12px",
  lineHeight: "1",
  padding: "5px 13px !important",
  border: "1px solid #555",
  textTransform: "none",
  borderRadius: "30px",
  margin: "5px",
}));

export default Created;
