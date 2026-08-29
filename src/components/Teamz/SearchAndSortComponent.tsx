"use client";
import React, { useState, Suspense } from "react";
import { Select, Input, Button, Typography, Form } from "antd";

import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { Text } = Typography;

const SearchAndSortComponent: React.FC = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("A to Z");
  const [search, setSearch] = useState("");

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    const CurrentParams = new URLSearchParams(window.location.search);
    if (order == "A to Z") {
      CurrentParams.set("sort", value);
    } else {
      CurrentParams.set("sort", `-${value}`);
    }
    router.replace(`?${CurrentParams.toString()}`, { scroll: false });
  };

  const handleOrderChange = (value: string) => {
    setOrder(value);
    const CurrentParams = new URLSearchParams(window.location.search);
    if (value == "A to Z") {
      CurrentParams.set("sort", sortBy);
    } else {
      CurrentParams.set("sort", `-${sortBy}`);
    }
    router.replace(`?${CurrentParams.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    const CurrentParams = new URLSearchParams(window.location.search);
    CurrentParams.set("searchTerm", `${search}`);
    setSearch(search);
    router.replace(`?${CurrentParams.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 md:flex-row md:justify-between md:items-center">
      <div className="flex flex-col items-start gap-2 w-full md:flex-row md:items-center md:w-auto">
        <Text strong className="text-[#053697]">
          Sort By:
        </Text>
        <Form
          requiredMark={false}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <Select
            className="border-2 border-[#2FC191] focus:border-[#2FC191] rounded-lg h-[42px] w-full md:w-32"
            value={sortBy}
            onChange={handleSortByChange}
          >
            <Option value="name">Name</Option>
            <Option value="sport">Sports</Option>
            {/* <Option value="position">Position</Option> */}
          </Select>
          <Select
            className="border-2 border-[#2FC191] focus:border-[#2FC191] rounded-lg h-[42px] w-full md:w-32"
            value={order}
            onChange={handleOrderChange}
          >
            <Option value="A to Z">A to Z</Option>
            <Option value="Z to A">Z to A</Option>
          </Select>
        </Form>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <Input
          className="border-2 border-[#2FC191] focus:border-[#2FC191] rounded-md w-full md:w-48"
          placeholder="Type here to search"
          prefix={<FaSearch />}
          value={search}
          onChange={handleSearchChange}
          style={{ height: 42 }}
        />
        <Button
          type="primary"
          className="bg-[#053697] text-white w-full sm:w-auto md:h-[42px]"
          onMouseEnter={(event: any) => (
            (event.target.style.backgroundColor = "#053697c9"),
            (event.target.style.color = "#fff")
          )}
          onMouseLeave={(event: any) => (
            (event.target.style.backgroundColor = "#053697"),
            (event.target.style.color = "#fff")
          )}
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchAndSortComponent;
