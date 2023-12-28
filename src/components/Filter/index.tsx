// import library used
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  GridItem,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// import redux state
import { useSelector } from "react-redux";
import { selectTasks } from "@/redux/taskSlice";

// import global style
import {
  backgroundColorHover,
  backgroundContainer,
  backgroundContainer2,
  borderColor,
  primaryTextColor,
  secondaryColor,
} from "../styles";

// import components used
import SearchOnInput from "./sections/SearchOnInput";
import AdvanceFilter from "./sections/AdvanceFilter";

// import icon from react-icons
import { FaTrash } from "react-icons/fa";
import { GoSortDesc } from "react-icons/go";
import {
  BsSortAlphaDown,
  BsSortAlphaDownAlt,
  BsAppIndicator,
  BsCalendarCheck,
} from "react-icons/bs";
import { AiOutlineFilter } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { TbProgressCheck } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { IoTimeOutline, IoTimerOutline } from "react-icons/io5";

// import function from utils
import { filterAbjad, filterByDeadline } from "@/util/sort";
import filterFeature from "@/util/filter";
import searchFeature from "@/util/search";

const FiltersField = (props: {
  sendData: any;
  resetFilter: any;
  useFilter: any;
  useCategory: boolean;
}) => {
  // tasks data
  const [data, setData] = useState([]);
  const tasks = useSelector(selectTasks);

  // state responsive
  const isMobile = useBreakpointValue({ base: true, md: false });

  // state popup sort
  const [isOpen, setIsOpen] = useState({
    sort: false,
    filter: false,
    value: false,
  });
  const [sort, setSort] = useState("sort");
  const [isSort, setIsSort] = useState(false);
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);

  // satte to filter feature for criteria custom and it's value
  const [criteria, setCriteria] = useState("");
  const [valueCri, setValueCri] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // state deadline
  const [isOpenDeadline, setIsOpenDeadline] = useState(false);

  // handler function to filter by custom criteria and value by criteria
  const handlerFilter = (props: { criteria: any; value: any }) => {
    const result = filterFeature({
      data: tasks,
      criteria: props.criteria,
      value: props.value,
    });
    setData(result);
    onClose("value");
  };

  // handler function to search feature
  const handleSearch = (value: any) => {
    const result = searchFeature({ term: value });
    if (value) {
      setData(result);
      props.useFilter(true);
    }
  };

  // handler function sort feature
  const handleSort = (value: string) => {
    const result = filterAbjad({ value: value });
    setSort(value === "az" ? "A-Z" : "Z-A");
    if (value) {
      setData(result);
      props.useFilter(true);
      onClose("sort");
    }
  };

  // function to handler sort bu deadline
  const handlerSortDeadline = (value: string) => {
    const result = filterByDeadline({ data: tasks, value: value });
    setData(result);
    setIsSort(true);
    props.useFilter(true);
    onClose("sort");
  };

  // handler checkbox selected item
  const handleCheckboxChange = (value: any) => {
    if (selectedOptions.includes(value)) {
      // Uncheck the checkbox and remove the value from the selectedItems array
      setSelectedOptions(selectedOptions.filter((item) => item !== value));
    } else {
      // Check the checkbox and add the value to the selectedItems array
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  // receive result form advance filter
  const handlerReceiveData = (value: any) => {
    setData(value);
    props.useFilter(true);
  };

  // handler hover on button
  const handleMouseEnter = () => {
    setIsOpenDeadline(true);
  };

  // handler to clear a filter
  const clearFilters = () => {
    const originalData = JSON.parse(localStorage.tasks);
    setData(originalData);
    setCriteria("");
    setValueCri([]);
    setSort("sort");
    setSelectedOptions([]);
    props.resetFilter(true);
  };

  // function to handler status popup
  const onOpen = (type: string) => {
    if (type === "sort") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        sort: true,
      }));
    } else if (type === "filter") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        filter: true,
      }));
    } else if (type === "value") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        value: true,
      }));
    }
  };

  // function to handler status popup
  const onClose = (type: string) => {
    if (type === "sort") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        sort: false,
      }));
    } else if (type === "filter") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        filter: false,
      }));
    } else if (type === "value") {
      setIsOpen((prevState: any) => ({
        ...prevState,
        value: false,
      }));
    }
  };

  // get unique category for filter criteria
  useEffect(() => {
    const uniqueValues = [...new Set(data.map((item) => item[criteria]))];
    setValueCri(uniqueValues);
    if (criteria !== "") {
      props.useFilter(true);
    }
  }, [criteria]);

  // send data if data changed
  useEffect(() => {
    props.sendData(data);
  }, [data]);

  // if used sort feature, send result
  useEffect(() => {
    if (isSort) {
      props.sendData(data);
      setIsSort(false);
    }
  }, [isSort]);

  // send default original data b'cause empty filter return dashboard page empty array
  useEffect(() => {
    setData(JSON.parse(localStorage.tasks));
  }, []);

  // filter if the user chooses to change the filter by criteria and value
  useEffect(() => {
    if (criteria) {
      handlerFilter({
        criteria: criteria,
        value: selectedOptions,
      });
    }
    if (selectedOptions.length > 0) {
      onOpen("value");
    }
  }, [criteria, selectedOptions]);

  // used filter and call handlerFilter function
  useEffect(() => {
    if (criteria !== "") {
      handlerFilter({
        data: tasks,
        criteria: criteria,
        value: selectedOptions,
      });
    }
  }, [tasks]);

  return (
    <Stack
      width="100%"
      backgroundColor={backgroundContainer()}
      padding={3}
      boxShadow={"sm"}
      rounded={"md"}
    >
      {/* header components */}
      {!isMobile ? (
        <Text fontSize={"sm"} color={secondaryColor()} fontWeight={"medium"}>
          Filter fields
        </Text>
      ) : null}
      <Stack>
        {/* search components */}
        {!isMobile ? (
          <Stack>
            <SearchOnInput sendValue={handleSearch} />
          </Stack>
        ) : null}
        <Spacer />

        {/* body filter components */}
        <Stack>
          <Stack gap={3}>
            <Grid
              // display={"flex"}
              alignItems={"center"}
              gap={2}
              minWidth={"100%"}
              maxWidth={"100%"}
            >
              {/* filter by compoennts */}
              <GridItem minWidth={"100%"}>
                <Text
                  fontSize={"sm"}
                  color={{ base: primaryTextColor(), md: secondaryColor() }}
                >
                  Filter By
                </Text>
              </GridItem>
              <GridItem width={"100%"}>
                <Popover
                  isOpen={isOpen.filter}
                  onOpen={() => onOpen("filter")}
                  onClose={() => onClose("filter")}
                >
                  <PopoverTrigger>
                    <Button
                      gap={2}
                      variant="ghost"
                      bg="transparent"
                      border={"1px"}
                      size={{ base: "md", md: "sm" }}
                      borderColor={backgroundContainer2()}
                      backgroundColor={backgroundContainer()}
                      color={primaryTextColor()}
                      _hover={{ backgroundColor: backgroundColorHover() }}
                      width={"100%"}
                      onClick={() => setIsOpenAdvanceFilter(false)}
                    >
                      {criteria === "" ? (
                        <AiOutlineFilter />
                      ) : criteria === "category" ? (
                        <BiCategoryAlt />
                      ) : criteria === "priority" ? (
                        <BsAppIndicator />
                      ) : (
                        <TbProgressCheck />
                      )}
                      <Text
                        fontWeight={{ base: "light", md: "medium" }}
                        fontSize={"sm"}
                      >
                        {criteria === ""
                          ? "Filter"
                          : criteria === "completed"
                          ? "Progress"
                          : criteria}
                      </Text>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    width={!isMobile ? "100%" : null}
                    backgroundColor={backgroundContainer()}
                    borderColor={borderColor()}
                  >
                    {!isOpenAdvanceFilter ? <PopoverArrow /> : null}
                    <PopoverBody>
                      {isOpenAdvanceFilter ? (
                        <AdvanceFilter
                          onOpen={isOpenAdvanceFilter}
                          sendData={handlerReceiveData}
                        />
                      ) : (
                        <Stack>
                          {props.useCategory ? (
                            <Button
                              justifyContent={"start"}
                              onClick={() => {
                                setCriteria("category");
                                onClose("filter");
                              }}
                              gap={2}
                              backgroundColor={"transparent"}
                              color={primaryTextColor()}
                              _hover={{
                                backgroundColor: backgroundColorHover(),
                              }}
                            >
                              <BiCategoryAlt />
                              <Text
                                fontWeight={{ base: "light", md: "medium" }}
                                fontSize={"14px"}
                              >
                                Category
                              </Text>
                            </Button>
                          ) : null}
                          <Button
                            justifyContent={"start"}
                            onClick={() => {
                              setCriteria("priority");
                              onClose("filter");
                            }}
                            gap={2}
                            backgroundColor={"transparent"}
                            color={primaryTextColor()}
                            _hover={{ backgroundColor: backgroundColorHover() }}
                          >
                            <BsAppIndicator />
                            <Text
                              fontWeight={{ base: "light", md: "medium" }}
                              fontSize={"14px"}
                            >
                              Priority
                            </Text>
                          </Button>
                          <Button
                            justifyContent={"start"}
                            onClick={() => {
                              setCriteria("completed");
                              onClose("filter");
                            }}
                            gap={2}
                            backgroundColor={"transparent"}
                            color={primaryTextColor()}
                            _hover={{ backgroundColor: backgroundColorHover() }}
                          >
                            <TbProgressCheck />
                            <Text
                              fontWeight={{ base: "light", md: "medium" }}
                              fontSize={"14px"}
                            >
                              Progress
                            </Text>
                          </Button>
                        </Stack>
                      )}
                    </PopoverBody>
                    <PopoverFooter>
                      <Button
                        onClick={() => {
                          setIsOpenAdvanceFilter(true);
                        }}
                        gap={2}
                        backgroundColor={"transparent"}
                        color={secondaryColor()}
                        _hover={{ backgroundColor: backgroundColorHover() }}
                      >
                        <AiOutlinePlus />
                        <Text
                          fontWeight={{ base: "light", md: "medium" }}
                          fontSize={"14px"}
                        >
                          Add advance filter
                        </Text>
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </GridItem>
            </Grid>

            {/* value by criteria selected components */}
            <Grid
              // display={"flex"}
              alignItems={"center"}
              gap={2}
              minWidth={"100%"}
            >
              <GridItem minWidth={"100%"}>
                <Text
                  fontSize={"sm"}
                  color={{ base: primaryTextColor(), md: secondaryColor() }}
                >
                  Value
                </Text>
              </GridItem>
              <GridItem width={"100%"}>
                <Popover
                  isOpen={isOpen.value}
                  onOpen={() => onOpen("value")}
                  onClose={() => onClose("value")}
                >
                  <PopoverTrigger>
                    <Button
                      gap={2}
                      isDisabled={criteria === "" ? true : false}
                      variant="ghost"
                      bg="transparent"
                      border={"1px"}
                      size={{ base: "md", md: "sm" }}
                      borderColor={backgroundContainer2()}
                      backgroundColor={backgroundContainer()}
                      color={primaryTextColor()}
                      _hover={{ backgroundColor: backgroundColorHover() }}
                      width={"100%"}
                    >
                      <GoSortDesc />
                      <Text
                        fontWeight={{ base: "light", md: "medium" }}
                        fontSize={"sm"}
                      >
                        Value
                      </Text>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    backgroundColor={backgroundContainer()}
                    borderColor={borderColor()}
                    width={!isMobile ? "100%" : null}
                  >
                    <PopoverArrow />
                    <PopoverBody maxH="200px" overflowY="auto">
                      <Stack>
                        {valueCri.map((item, index) => (
                          <Checkbox
                            key={index}
                            isChecked={selectedOptions.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                          >
                            {criteria === "completed"
                              ? item
                                ? "Done"
                                : "Doing"
                              : item}
                          </Checkbox>
                        ))}
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </GridItem>
            </Grid>

            {/* sort components */}
            <Grid
              // display={"flex"}
              alignItems={"center"}
              gap={2}
              minWidth={"100%"}
            >
              <GridItem minWidth={"100%"}>
                <Text
                  fontSize={"sm"}
                  color={{ base: primaryTextColor(), md: secondaryColor() }}
                >
                  Sort By
                </Text>
              </GridItem>
              <GridItem width={"100%"}>
                <Popover
                  isOpen={isOpen.sort}
                  onOpen={() => onOpen("sort")}
                  onClose={() => onClose("sort")}
                >
                  <PopoverTrigger>
                    <Button
                      gap={2}
                      variant="ghost"
                      bg="transparent"
                      border={"1px"}
                      size={{ base: "md", md: "sm" }}
                      borderColor={backgroundContainer2()}
                      backgroundColor={backgroundContainer()}
                      color={primaryTextColor()}
                      _hover={{ backgroundColor: backgroundColorHover() }}
                      width={"100%"}
                    >
                      <GoSortDesc />
                      <Text
                        fontWeight={{ base: "light", md: "medium" }}
                        fontSize={"sm"}
                      >
                        {sort}
                      </Text>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    width={!isMobile ? "100%" : null}
                    backgroundColor={backgroundContainer()}
                    borderColor={borderColor()}
                  >
                    <PopoverArrow />
                    <PopoverBody>
                      <Stack>
                        <Button
                          justifyContent={"start"}
                          onClick={() => handleSort("az")}
                          gap={2}
                          backgroundColor={"transparent"}
                          color={primaryTextColor()}
                          _hover={{ backgroundColor: backgroundColorHover() }}
                        >
                          <BsSortAlphaDown />
                          <Text
                            fontWeight={{ base: "light", md: "medium" }}
                            fontSize={"14px"}
                          >
                            Sort A-Z
                          </Text>
                        </Button>
                        <Button
                          justifyContent={"start"}
                          onClick={() => handleSort("za")}
                          gap={2}
                          backgroundColor={"transparent"}
                          color={primaryTextColor()}
                          _hover={{ backgroundColor: backgroundColorHover() }}
                        >
                          <BsSortAlphaDownAlt />
                          <Text
                            fontWeight={{ base: "light", md: "medium" }}
                            fontSize={"14px"}
                          >
                            Sort Z-A
                          </Text>
                        </Button>
                        <Popover
                          isOpen={isOpenDeadline}
                          placement={!isMobile ? "left-start" : "bottom"}
                        >
                          <PopoverTrigger>
                            <Button
                              // onClick={handlerSortDeadline}
                              justifyContent={"start"}
                              gap={2}
                              backgroundColor={"transparent"}
                              color={primaryTextColor()}
                              _hover={{
                                backgroundColor: backgroundColorHover(),
                              }}
                              onMouseEnter={handleMouseEnter}
                            >
                              <BsCalendarCheck />
                              <Text
                                fontWeight={{ base: "light", md: "medium" }}
                                fontSize={"14px"}
                              >
                                Deadline
                              </Text>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            width={!isMobile ? "100%" : null}
                            backgroundColor={backgroundContainer()}
                            borderColor={borderColor()}
                          >
                            <PopoverArrow />
                            <PopoverBody>
                              <Stack>
                                <Button
                                  gap={2}
                                  backgroundColor={"transparent"}
                                  color={primaryTextColor()}
                                  _hover={{
                                    backgroundColor: backgroundColorHover(),
                                  }}
                                  justifyContent={"start"}
                                  onClick={() => {
                                    setIsOpenDeadline(false);
                                    handlerSortDeadline("Nearest");
                                  }}
                                >
                                  <IoTimeOutline />
                                  <Text
                                    fontWeight={{ base: "light", md: "medium" }}
                                    fontSize={"14px"}
                                  >
                                    Nearest
                                  </Text>
                                </Button>
                                <Button
                                  gap={2}
                                  backgroundColor={"transparent"}
                                  color={primaryTextColor()}
                                  _hover={{
                                    backgroundColor: backgroundColorHover(),
                                  }}
                                  onClick={() => {
                                    setIsOpenDeadline(false);
                                    handlerSortDeadline("Furthest");
                                  }}
                                  justifyContent={"start"}
                                >
                                  <IoTimerOutline />
                                  <Text
                                    fontWeight={{ base: "light", md: "medium" }}
                                    fontSize={"14px"}
                                  >
                                    Furthest
                                  </Text>
                                </Button>
                              </Stack>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </GridItem>
            </Grid>

            {/* clear filter all rules components */}
            {isMobile ? <Divider marginY={4} /> : null}
            <Button
              onClick={clearFilters}
              color={"gray.400"}
              backgroundColor={backgroundContainer2()}
              _hover={{ backgroundColor: backgroundColorHover() }}
            >
              {!isMobile ? (
                <FaTrash />
              ) : (
                <Text fontWeight={"medium"}>Clear Filter</Text>
              )}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FiltersField;
