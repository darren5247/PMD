import { FC, useState, useEffect } from "react";
import cn from "classnames";
import { useRouter } from "next/router";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Form from "@src/components/Form";
import Field from "@src/components/Field";
import SearchInputItem from "@src/components/SearchInputItem";

interface ISearchFormItemProps {
  pageLink: string;
  className?: string;
}

interface ISearchFormItem {
  search: string;
}

type TSearchFormItem = ISearchFormItem | FieldValues;

const SearchFormItem: FC<ISearchFormItemProps> = ({
  pageLink,
  className,
}): JSX.Element => {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<TSearchFormItem>();
  const [queryOnLoad, setQueryOnLoad] = useState<string>("");

  useEffect(() => {
    const query = router.query.q || "";
    setQueryOnLoad(Array.isArray(query) ? query.join("") : query);
  }, [router]);

  const handleSearch: SubmitHandler<TSearchFormItem> = ({ search }) => {
    if (search) {
      if (search.trim() !== queryOnLoad) {
        if (router.pathname === `/${pageLink}`) {
          router.push({
            pathname: `/${pageLink}`,
            query: { ...router.query, q: search.trim() },
          });
        } else {
          router.push({
            pathname: `/${pageLink}`,
            query: { q: search.trim() },
          });
        }
      }
    } else {
      if (router.pathname === `/${pageLink}`) {
        if (search.trim() !== queryOnLoad) {
          router
            .push({
              pathname: `/${pageLink}`,
              query: { ...router.query, q: null },
            })
            .then(() => {
              router.reload();
            });
        }
      } else {
        router.push({
          pathname: `/${pageLink}`,
        });
      }
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(handleSearch)}
      className={cn(
        "w-full mx-auto px-0 flex flex-row justify-center items-stretch gap-2",
        className,
      )}
    >
      <Field
        name="search"
        component={SearchInputItem}
        control={control}
        formState={formState}
        placeholder="Search by term"
        className={"mt-0"}
        value={router.query.q || ""}
        onSubmit={handleSubmit(handleSearch)}
      />
    </Form>
  );
};

export default SearchFormItem;
