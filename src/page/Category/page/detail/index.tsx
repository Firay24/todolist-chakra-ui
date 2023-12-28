// import library used
import { Flex, HStack, Heading, Spacer, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import global state from redux flow
import { useSelector } from "react-redux";
import { selectTasks } from "@/redux/taskSlice";

// import component used
import CardTask from "@/components/CardTask";
import ButtonBack from "@/components/ButtonBack";
import ButtonPriority from "@/components/ButtonPriority";
import FiltersField from "@/components/Filter";

// import global style
import { primaryTextColor } from "@/components/styles";
import SearchOnInput from "@/components/Filter/sections/SearchOnInput";
import ModalFilter from "@/components/ModalFilter";
import NullContent from "@/components/NullContent";

// interface
interface taskInterface {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  category: string;
}

const DetailCategory = () => {
  const tasks = useSelector(selectTasks);
  const { category } = useParams();

  // tasks state
  const [data, setData] = useState<taskInterface[]>([]);

  // state to trigger the effects of data and filter changes
  const [isTitleUpdated, setIsTitleUpdated] = useState<boolean>(false);
  const [updated, setUpdated] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const [useFilter, setUseFilter] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // update data if there is a change in task
  useEffect(() => {
    const filter = tasks.filter(
      (item: any) =>
        item.category === category ||
        item.category === (category && category.replace(/-/g, " "))
    );
    setData(filter);
  }, [tasks]);

  // update data if there is a change in link path
  useEffect(() => {
    const filter = tasks.filter(
      (item: any) =>
        item.category === category ||
        item.category === (category && category.replace(/-/g, " "))
    );
    setData(filter);
  }, [category]);

  // handle receive status title updated
  const handleTitleUpdated = (value: any) => {
    setIsTitleUpdated(value);
  };

  // handle updated from card content
  const handlerUpdated = (value: any) => {
    setUpdated(value);
  };

  // handler to receive if done deketed
  const handlerStatusDeleted = (value: any) => {
    setDeleted(value);
  };

  // handle to receive a confirmation that an update occurred on the completed
  const handleUpdateCompleted = (value: any) => {
    setUpdateCompleted(value);
  };

  // handle to receive a confirmation that an deleted occurred on a task
  const handleDelete = (value: any) => {
    if (value) {
      setUseFilter(false);
    }
  };

  const handlerResetFilter = (value: any) => {
    setUseFilter(!value);
  };

  const handlerUseFilter = (value: any) => {
    if (value !== "" && value !== undefined && value !== null) {
      setUseFilter(true);
    }
  };

  // handler function get data from filter priority fields
  const handlerReceiveData = (value: any) => {
    const filter = value.filter(
      (item: any) =>
        item.category === category ||
        item.category === (category && category.replace(/-/g, " "))
    );
    setData(filter);
  };

  // handler receive result
  const handleSearch = (value: any) => {
    const result = searchFeature({ term: value });
    setData(result);
    setUseFilter(true);
  };

  // get data from global state redux
  useEffect(() => {
    if (!useFilter) {
      const filter = tasks.filter(
        (item: any) =>
          item.category === category ||
          item.category === (category && category.replace(/-/g, " "))
      );
      setData(filter);
    }
  }, [tasks, useFilter]);

  // update data if there is a trigger on updated title
  useEffect(() => {
    if (isTitleUpdated) {
      const filter = tasks.filter(
        (item: any) =>
          item.category === category ||
          item.category === (category && category.replace(/-/g, " "))
      );
      setData(filter);
    }
    setIsTitleUpdated(false);
  }, [isTitleUpdated]);

  // update data if there is a trigger on updated a task
  useEffect(() => {
    if (updated) {
      const filter = tasks.filter(
        (item: any) =>
          item.category === category ||
          item.category === (category && category.replace(/-/g, " "))
      );
      setData(filter);
    }
    setUpdated(false);
  }, [updated]);

  // update data if there is a trigger on updated completed a task
  useEffect(() => {
    if (updateCompleted) {
      const filter = tasks.filter(
        (item: any) =>
          item.category === category ||
          item.category === (category && category.replace(/-/g, " "))
      );
      setData(filter);
    }
    setUpdateCompleted(false);
  }, [updateCompleted]);

  return (
    <Stack padding={3} width="full" minHeight={{ base: "200vh", md: "100vh" }}>
      {/* header */}
      <Stack width="100%">
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent={{ base: "flex-start", md: "flex-end" }}
          gap={4}
        >
          <HStack gap={4} width={"full"}>
            <Heading
              fontSize={"2xl"}
              color={primaryTextColor()}
              marginLeft={{ base: 8, md: 0 }}
            >
              {category && category.replace(/-/g, " ")}
            </Heading>
            <Spacer />
            <ButtonBack />
          </HStack>

          <Stack spacing={2} width={"full"}>
            <Stack display={"flex"} flexDirection={"row"}>
              <ButtonPriority
                sendData={handlerReceiveData}
                useFilter={handlerUseFilter}
                deleted={deleted}
                statusDeleted={handlerStatusDeleted}
              />
              <ModalFilter
                handlerReceiveData={handlerReceiveData}
                handlerResetFilter={handlerResetFilter}
                handlerUseFilter={handlerUseFilter}
              />
              {/* <Button
                    size={"sm"}
                    color={primaryTextColor()}
                    backgroundColor={backgroundContainer()}
                  >
                    <MdFilterAlt />
                  </Button> */}
            </Stack>
            <Stack marginTop={2}>
              <SearchOnInput sendValue={handleSearch} />
            </Stack>
            {/* <HStack>
                  <DragComponent />
                  <ButtonExport data={data} />
                </HStack> */}
          </Stack>
        </Flex>
      </Stack>

      {/* <HStack>
        <HStack gap={4} width={"full"}>
          <Heading
            fontSize={"2xl"}
            color={primaryTextColor()}
            marginLeft={{ base: 8, md: 0 }}
          >
            {category && category.replace(/-/g, " ")}
          </Heading>
          <ButtonBack />
        </HStack>
        <Spacer />
        <ButtonPriority
          sendData={handlerReceiveData}
          useFilter={handlerUseFilter}
        />
      </HStack> */}

      {/* filters field */}
      <Stack marginTop={3} width="100%">
        {/* <FiltersField
          sendData={handlerReceiveData}
          resetFilter={handlerResetFilter}
          useFilter={handlerUseFilter}
          useCategory={false}
        /> */}
      </Stack>
      {/* content tasks */}
      <Stack marginTop={3} direction="row" wrap="wrap" spacing={3}>
        {data.length > 0 ? (
          data.map((task: taskInterface, index: number) => (
            <CardTask
              key={index}
              task={task}
              titleUpdated={handleTitleUpdated}
              updated={handlerUpdated}
              updateCompleted={handleUpdateCompleted}
              deleted={handleDelete}
              layout="grid"
            />
          ))
        ) : (
          <NullContent />
        )}
      </Stack>
    </Stack>
  );
};

export default DetailCategory;
