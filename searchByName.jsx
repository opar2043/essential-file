    const [course] = useCourse([]);
    const [search , setSearch] = useState('');
    const [dbSearch, setDbSearch] = useState('');
  
    useEffect(()=>{
      const timer = setTimeout(()=>{
        setDbSearch(search)
      },500);
  
      return ()=> clearTimeout(timer);
    } , [search]);
  
  
    const filterCourse = course.filter(cor =>
       cor.title?.toLowerCase().includes(dbSearch.toLowerCase())
    );